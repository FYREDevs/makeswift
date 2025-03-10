import { WidthProperty } from 'csstype'
import { CSSObject } from '@emotion/css'

import {
  ResponsiveValue,
  ResponsiveValueType as ExtractResponsiveValue,
  Length as LengthValue,
  WidthValue,
  PaddingValue,
  MarginValue,
  BorderRadiusValue,
  TextStyleValue,
} from '../../prop-controllers/descriptors'
import {
  FallbackStrategy,
  getDevice,
  getDeviceMediaQuery,
  join as joinResponsiveValues,
} from './devices'
import { getIndexes } from './columns'
import { PaddingPropertyData, paddingPropertyDataToStyle } from '../../css/padding'
import { MarginPropertyData, marginPropertyDataToStyle } from '../../css/margin'
import { BorderRadiusPropertyData, borderRadiusPropertyDataToStyle } from '../../css/border-radius'
import { BorderPropertyData, borderPropertyDataToStyle } from '../../css/border'
import { BorderPropControllerData } from '../hooks/useBorder'
import { colorToString } from './colorToString'
import { BoxShadowData, BoxShadowPropControllerData } from '../hooks'

export function responsiveStyle<V, A extends ReadonlyArray<ResponsiveValue<V> | null | undefined>>(
  responsiveValues: A,
  join: (values: { [K in keyof A]: ExtractResponsiveValue<A[K]> | undefined }) => CSSObject,
  strategy?: FallbackStrategy<V>,
): CSSObject {
  return joinResponsiveValues(responsiveValues, join, strategy).reduce(
    (acc, { deviceId, value }) => {
      const device = getDevice(deviceId)
      const mediaQuery = getDeviceMediaQuery(device)

      return {
        ...acc,
        [mediaQuery]: {
          ...(acc[mediaQuery] as CSSObject),
          ...value,
        },
      }
    },
    {} as CSSObject,
  )
}

export function responsiveWidth(
  widthData: WidthValue | undefined,
  defaultValue: LengthValue | WidthProperty<string | number> = '100%',
): CSSObject {
  return {
    maxWidth: '100%',
    ...responsiveStyle([widthData], ([width = defaultValue]) => ({
      width: typeof width === 'object' ? `${width.value}${width.unit}` : width,
    })),
  }
}

export function responsivePadding(
  paddingData: PaddingValue | undefined,
  defaultValue: PaddingPropertyData = {} as PaddingPropertyData,
): CSSObject {
  return responsiveStyle([paddingData], ([padding = {} as PaddingPropertyData]) =>
    paddingPropertyDataToStyle(
      padding,
      Object.assign(
        { paddingTop: 0, paddingRight: 0, paddingBottom: 0, paddingLeft: 0 },
        defaultValue,
      ),
    ),
  )
}

export function responsiveMargin(
  marginData: MarginValue | undefined,
  defaultValue: MarginPropertyData = {} as MarginPropertyData,
): CSSObject {
  return responsiveStyle([marginData], ([margin = {} as MarginPropertyData]) =>
    marginPropertyDataToStyle(
      margin,
      Object.assign(
        { marginTop: 0, marginRight: 'auto', marginBottom: 0, marginLeft: 'auto' },
        defaultValue,
      ),
    ),
  )
}

export function responsiveBorderRadius(
  borderRadiusData: BorderRadiusValue | undefined,
  defaultValue: BorderRadiusPropertyData = {} as BorderRadiusPropertyData,
): CSSObject {
  return responsiveStyle([borderRadiusData], ([borderRadius = {}]) =>
    borderRadiusPropertyDataToStyle(
      borderRadius,
      Object.assign(
        {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
        },
        defaultValue,
      ),
    ),
  )
}

export function responsiveBorder(
  borderData: BorderPropControllerData | undefined,
  defaultValue: BorderPropertyData = {},
): CSSObject {
  return responsiveStyle([borderData], ([border = {}]) =>
    borderPropertyDataToStyle(
      border,
      Object.assign(
        {
          borderTop: '0px solid black',
          borderRight: '0px solid black',
          borderBottom: '0px solid black',
          borderLeft: '0px solid black',
        },
        defaultValue,
      ),
    ),
  )
}

const floor =
  (d: number) =>
  (v: number): number =>
    Math.floor(10 ** d * v) / 10 ** d

export function responsiveGridItem(props: {
  grid: ResponsiveValue<{ spans: number[][]; count: number }>
  index: number
  columnGap?: ResponsiveValue<LengthValue>
  rowGap?: ResponsiveValue<LengthValue>
}): CSSObject {
  return {
    display: 'flex',
    ...responsiveStyle(
      [props.grid, props.columnGap, props.rowGap] as const,
      ([
        { spans, count } = { spans: [[12]], count: 12 },
        columnGap = { value: 0, unit: 'px' },
        rowGap = { value: 0, unit: 'px' },
      ]) => {
        const [rowIndex, columnIndex] = getIndexes(spans, props.index)
        const firstCol = columnIndex === 0
        const lastCol = columnIndex === spans[rowIndex].length - 1
        const span = spans[rowIndex][columnIndex]
        const fraction = floor(5)(span / count)
        const width = `${fraction} * (100% + ${columnGap.value}${columnGap.unit})`
        const excessWidth = `${Number(firstCol) + Number(lastCol)} * ${columnGap.value}${
          columnGap.unit
        } / 2`
        const iePrecisionError = '0.01px'
        const flexBasis = `calc(${width} - ${excessWidth} - ${iePrecisionError})`
        const firstRow = rowIndex === 0
        const lastRow = rowIndex === spans.length - 1

        return span === 0
          ? { display: 'none' }
          : {
              flexBasis,
              minWidth: flexBasis,
              // NOTE: IE11 width breaks without max width
              // https://github.com/philipwalton/flexbugs/issues/3
              maxWidth: flexBasis,
              paddingLeft: firstCol ? 0 : `${columnGap.value / 2}${columnGap.unit}`,
              paddingRight: lastCol ? 0 : `${columnGap.value / 2}${columnGap.unit}`,
              paddingTop: firstRow ? 0 : `${rowGap.value / 2}${rowGap.unit}`,
              paddingBottom: lastRow ? 0 : `${rowGap.value / 2}${rowGap.unit}`,
            }
      },
    ),
  }
}

const getBoxShadow = (shadows: BoxShadowData) =>
  shadows
    .map(
      ({ payload: { inset, offsetX, offsetY, blurRadius, spreadRadius, color } }) =>
        `${inset ? 'inset ' : ''}${offsetX.toFixed(1)}px ${offsetY.toFixed(
          1,
        )}px ${blurRadius}px ${spreadRadius}px ${
          color != null ? colorToString(color) : 'rgba(0,0,0,0.2)'
        }`,
    )
    .filter(Boolean)
    .join()

export function responsiveShadow(value: BoxShadowPropControllerData | undefined): CSSObject {
  return responsiveStyle([value], ([shadow = []]) => ({
    boxShadow: getBoxShadow(shadow),
  }))
}

export function responsiveTextStyle(value: TextStyleValue | undefined): CSSObject {
  return responsiveStyle(
    [value],
    ([
      textStyle = {
        fontFamily: null,
        letterSpacing: null,
        fontSize: null,
        fontWeight: null,
        textTransform: [],
        fontStyle: [],
      },
    ]) => {
      const {
        fontSize,
        fontWeight,
        fontStyle = [],
        textTransform = [],
        letterSpacing,
        fontFamily,
      } = textStyle

      return {
        ...(fontFamily == null ? {} : { fontFamily }),
        ...(fontWeight == null ? {} : { fontWeight }),
        ...(letterSpacing == null ? {} : { letterSpacing }),
        ...(fontSize == null ? {} : { fontSize: `${fontSize.value}${fontSize.unit}` }),
        ...(textTransform.includes('uppercase') ? { textTransform: 'uppercase' } : {}),
        ...(fontStyle.includes('italic') ? { fontStyle: 'italic' } : {}),
      }
    },
  )
}

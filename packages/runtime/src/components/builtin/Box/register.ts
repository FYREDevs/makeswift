import dynamic from 'next/dynamic'

import { forwardNextDynamicRef } from '../../../next'
import { Props, ResponsiveValue } from '../../../prop-controllers'
import { ReactRuntime } from '../../../runtimes/react'
import { findDeviceOverride } from '../../utils/devices'
import { MakeswiftComponentType } from '../constants'
import {
  BoxAnimateIn,
  DEFAULT_BOX_ANIMATE_DELAY,
  DEFAULT_BOX_ANIMATE_DURATION,
  DEFAULT_ITEM_ANIMATE_DELAY,
  DEFAULT_ITEM_STAGGER_DURATION,
} from './constants'

export function registerComponent(runtime: ReactRuntime) {
  function isHiddenBasedOnAnimationType(
    props: Record<string, unknown>,
    deviceId: string,
    property: 'boxAnimateType' | 'itemAnimateType',
  ): boolean {
    const animateIn = props[property] as ResponsiveValue<BoxAnimateIn>
    return (findDeviceOverride<BoxAnimateIn>(animateIn, deviceId)?.value ?? 'none') === 'none'
  }
  const isHiddenBasedOnBoxAnimation = (props: Record<string, unknown>, deviceId: string) =>
    isHiddenBasedOnAnimationType(props, deviceId, 'boxAnimateType')
  const isHiddenBasedOnItemAnimation = (props: Record<string, unknown>, deviceId: string) =>
    isHiddenBasedOnAnimationType(props, deviceId, 'itemAnimateType')

  return runtime.registerComponent(
    forwardNextDynamicRef(patch => dynamic(() => patch(import('./Box')))),
    {
      type: MakeswiftComponentType.Box,
      label: 'Box',
      props: {
        id: Props.ElementID(),
        backgrounds: Props.Backgrounds(),
        width: Props.Width({ format: Props.Width.Format.ClassName }),
        height: Props.ResponsiveIconRadioGroup({
          label: 'Height',
          options: [
            { value: 'auto', label: 'Auto', icon: 'HeightAuto16' },
            { value: 'stretch', label: 'Stretch', icon: 'HeightMatch16' },
          ],
          defaultValue: 'auto',
        }),
        verticalAlign: Props.ResponsiveIconRadioGroup({
          label: 'Align items',
          options: [
            { value: 'flex-start', label: 'Top', icon: 'VerticalAlignStart16' },
            { value: 'center', label: 'Middle', icon: 'VerticalAlignMiddle16' },
            { value: 'flex-end', label: 'Bottom', icon: 'VerticalAlignEnd16' },
            {
              value: 'space-between',
              label: 'Space between',
              icon: 'VerticalAlignSpaceBetween16',
            },
          ],
          defaultValue: 'flex-start',
        }),
        margin: Props.Margin({ format: Props.Margin.Format.ClassName }),
        padding: Props.Padding({
          format: Props.Padding.Format.ClassName,
          preset: [
            {
              deviceId: 'desktop',
              value: {
                paddingTop: { value: 10, unit: 'px' },
                paddingRight: { value: 10, unit: 'px' },
                paddingBottom: { value: 10, unit: 'px' },
                paddingLeft: { value: 10, unit: 'px' },
              },
            },
          ],
        }),
        border: Props.Border({ format: Props.Border.Format.ClassName }),
        borderRadius: Props.BorderRadius({ format: Props.BorderRadius.Format.ClassName }),
        boxShadow: Props.Shadows({ format: Props.Shadows.Format.ClassName }),
        rowGap: Props.GapY(props => ({
          hidden: props.children == null,
        })),
        columnGap: Props.GapX(props => ({
          hidden: props.children == null,
        })),
        boxAnimateType: Props.ResponsiveSelect({
          label: 'Animate box in',
          labelOrientation: 'vertical',
          options: [
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade in' },
            { value: 'fadeRight', label: 'Fade right' },
            { value: 'fadeDown', label: 'Fade down' },
            { value: 'fadeLeft', label: 'Fade left' },
            { value: 'fadeUp', label: 'Fade up' },
            { value: 'blurIn', label: 'Blur in' },
            { value: 'scaleUp', label: 'Scale up' },
            { value: 'scaleDown', label: 'Scale down' },
          ],
          defaultValue: 'none',
        }),
        boxAnimateDuration: Props.ResponsiveNumber((props, device) => ({
          label: 'Box duration',
          defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
          min: 0.1,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnBoxAnimation(props, device),
        })),
        boxAnimateDelay: Props.ResponsiveNumber((props, device) => ({
          label: 'Box delay',
          defaultValue: DEFAULT_BOX_ANIMATE_DELAY,
          min: 0,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnBoxAnimation(props, device),
        })),
        itemAnimateType: Props.ResponsiveSelect({
          label: 'Animate items in',
          labelOrientation: 'vertical',
          options: [
            { value: 'none', label: 'None' },
            { value: 'fadeIn', label: 'Fade in' },
            { value: 'fadeRight', label: 'Fade right' },
            { value: 'fadeDown', label: 'Fade down' },
            { value: 'fadeLeft', label: 'Fade left' },
            { value: 'fadeUp', label: 'Fade up' },
            { value: 'blurIn', label: 'Blur in' },
            { value: 'scaleUp', label: 'Scale up' },
            { value: 'scaleDown', label: 'Scale down' },
          ],
          defaultValue: 'none',
        }),
        itemAnimateDuration: Props.ResponsiveNumber((props, device) => ({
          label: 'Items duration',
          defaultValue: DEFAULT_BOX_ANIMATE_DURATION,
          min: 0.1,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnItemAnimation(props, device),
        })),
        itemAnimateDelay: Props.ResponsiveNumber((props, device) => ({
          label: 'Items delay',
          defaultValue: DEFAULT_ITEM_ANIMATE_DELAY,
          min: 0,
          step: 0.05,
          suffix: 's',
          hidden: isHiddenBasedOnItemAnimation(props, device),
        })),
        itemStaggerDuration: Props.ResponsiveNumber((props, device) => ({
          label: 'Stagger',
          min: 0,
          step: 0.05,
          suffix: 's',
          defaultValue: DEFAULT_ITEM_STAGGER_DURATION,
          hidden: isHiddenBasedOnItemAnimation(props, device),
        })),
        hidePlaceholder: Props.Checkbox(props => ({
          label: 'Hide placeholder',
          hidden: props.children != null,
        })),
        children: Props.Grid(),
      },
    },
  )
}

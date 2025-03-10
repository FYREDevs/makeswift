import { Descriptor } from './descriptors'
import { copy as backgroundsCopy } from './copy/backgrounds'
import { copy as gridCopy } from './copy/grid'
import { copy as navigationLinksCopy } from './copy/navigation-links'
import { copy as linkCopy } from './copy/link'
import { copy as shadowsCopy } from './copy/shadows'
import { copy as imageCopy } from './copy/image'
import { copy as imagesCopy } from './copy/images'
import { copy as responsiveColorCopy } from './copy/responsive-color'
import { copy as tableFormFieldsCopy } from './copy/table-form-fields'
import { copy as tableCopy } from './copy/table'
import { copy as borderCopy } from './copy/border'
import { copy as richTextCopy } from './copy/rich-text'
import { copy as elementIdCopy } from './copy/element-id'
import { CopyContext } from '../state/react-page'

// @note: note typing value, because would then have to type narrow `Data` per case
export function copy(descriptor: Descriptor, value: any, context: CopyContext) {
  switch (descriptor.type) {
    case 'Backgrounds':
      return backgroundsCopy(value, context)
    case 'Grid':
      return gridCopy(value, context)
    case 'NavigationLinks':
      return navigationLinksCopy(value, context)
    case 'Link':
      return linkCopy(value, context)
    case 'Shadows':
      return shadowsCopy(value, context)
    case 'Image':
      return imageCopy(value, context)
    case 'Images':
      return imagesCopy(value, context)
    case 'ResponsiveColor':
      return responsiveColorCopy(value, context)
    case 'TableFormFields':
      return tableFormFieldsCopy(value, context)
    case 'Table':
      return tableCopy(value, context)
    case 'Border':
      return borderCopy(value, context)
    case 'RichText':
      return richTextCopy(value, context)
    case 'ElementID':
      return elementIdCopy(value, context)
    default:
      return value
  }
}

export function copyElementReference(value: string, context: CopyContext) {
  return context.replacementContext.globalElementIds.get(value) || value
}

import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular'
import { ThumbnailHDFComponent } from './thumbnail-hdf.component'

export default {
  title: 'Elements/ThumbnailHDFComponent',
  component: ThumbnailHDFComponent,
  decorators: [
    moduleMetadata({
      imports: [ThumbnailHDFComponent],
    }),
    componentWrapperDecorator(
      (story) => `<div style="max-width: 800px">${story}</div>`
    ),
  ],
} as Meta<ThumbnailHDFComponent>

export const Primary: StoryObj<ThumbnailHDFComponent> = {}

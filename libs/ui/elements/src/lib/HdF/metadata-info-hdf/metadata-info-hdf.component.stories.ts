import { provideI18n } from '@geonetwork-ui/util/i18n'
import { applicationConfig, Meta, StoryObj } from '@storybook/angular'
import { MetadataInfoHDFComponent } from './metadata-info-hdf.component'
import { datasetRecordsFixture } from '@geonetwork-ui/common/fixtures'
import { DatasetRecord } from '@geonetwork-ui/common/domain/model/record'

export default {
  title: 'Elements/MetadataInfoHDFComponent',
  component: MetadataInfoHDFComponent,
  decorators: [
    applicationConfig({
      providers: [provideI18n()],
    }),
  ],
} as Meta<MetadataInfoHDFComponent>

export const Primary: StoryObj<MetadataInfoHDFComponent> = {
  args: {
    metadata: datasetRecordsFixture()[0] as Partial<DatasetRecord>,
    incomplete: false,
  },
}

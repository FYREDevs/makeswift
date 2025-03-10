import {
  FileFragment,
  GlobalElementFragment,
  PageFragment,
  PagePathnameSliceFragment,
  SiteFragment,
  SwatchFragment,
  TableFragment,
  TypographyFragment,
} from './fragments'

export const IntrospectedResourcesQuery = /* GraphQL */ `
  query IntrospectedResources(
    $swatchIds: [ID!]!
    $fileIds: [ID!]!
    $typographyIds: [ID!]!
    $pageIds: [ID!]!
    $tableIds: [ID!]!
  ) {
    swatches(ids: $swatchIds) {
      ...Swatch
    }

    files(ids: $fileIds) {
      ...File
    }

    typographies(ids: $typographyIds) {
      ...Typography
    }

    pagePathnamesById(ids: $pageIds) {
      ...PagePathnameSlice
    }

    tables(ids: $tableIds) {
      ...Table
    }
  }

  ${SwatchFragment}
  ${FileFragment}
  ${TypographyFragment}
  ${PagePathnameSliceFragment}
  ${TableFragment}
`

export const SwatchQuery = /* GraphQL */ `
  query Swatch($swatchId: ID!) {
    swatch(id: $swatchId) {
      ...Swatch
    }
  }

  ${SwatchFragment}
`

export const FileQuery = /* GraphQL */ `
  query File($fileId: ID!) {
    file(id: $fileId) {
      ...File
    }
  }

  ${FileFragment}
`

export const TypographyQuery = /* GraphQL */ `
  query Typography($typographyId: ID!) {
    typography(id: $typographyId) {
      ...Typography
    }
  }

  ${TypographyFragment}
`

export const PagePathnamesByIdQuery = /* GraphQL */ `
  query PagePathnamesById($pageIds: [ID!]!) {
    pagePathnamesById(ids: $pageIds) {
      ...PagePathnameSlice
    }
  }

  ${PagePathnameSliceFragment}
`

export const TableQuery = /* GraphQL */ `
  query Table($tableId: ID!) {
    table(id: $tableId) {
      ...Table
    }
  }

  ${TableFragment}
`

export const TypographiesQuery = /* GraphQL */ `
  query Typographies($typographyIds: [ID!]!) {
    typographies(ids: $typographyIds) {
      ...Typography
    }
  }

  ${TypographyFragment}
`

export const GlobalElementQuery = /* GraphQL */ `
  query GlobalElement($globalElementId: ID!) {
    globalElement(id: $globalElementId) {
      ...GlobalElement
    }
  }

  ${GlobalElementFragment}
`

export const CreateTableRecordMutation = /* GraphQL */ `
  mutation CreateTableRecord($input: CreateTableRecordInput!) {
    createTableRecord(input: $input) {
      tableRecord {
        id
      }
    }
  }
`

export const SiteQuery = /* GraphQL */ `
  query Site($siteId: ID!) {
    site(id: $siteId) {
      ...Site
    }
  }

  ${SiteFragment}
`

export const PageQuery = /* GraphQL */ `
  query Page($pageId: ID!) {
    page(id: $pageId) {
      ...Page
    }
  }

  ${PageFragment}
`

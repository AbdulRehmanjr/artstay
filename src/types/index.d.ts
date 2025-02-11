
type TraingEducationEnum = 'FORMAL' | 'NON_FORMAL'
type CertificationEnum  ='NONE' | 'PROFESSIONAL' | 'TRADE' | 'WORKSHOP'
type RecongnitionEnum = 'STATE' | 'NATIONAL' | 'INTERNATIONAL'
type ExperienceEnum = 'APPRENTICE' | 'CRAFTMAN' | 'MASTER' | 'GRANDMASTER'
type ApiResponseProps<T> = {
  status: boolean;
  message: string;
  data: T;
};

type CraftProps = {
  craftName: string;
  craftSlug: string;
  craftId: string;
  createdAt: Date;
  updateAt: Date;
}

type SubCraftProps = {
  subCraftId: string;
  craftId: string;
  subCraftName: string
  subCraftSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

type ArtisanDetailProps = {
  artisanId: string
  firstName: string,
  lastName: string,
  address: string,
  description: string,
  experience: string,
  education: string,
  training: string,
  certificate: string,
  recongnition: string,
  craftId: string,
  subCraftId: string,
  dp: string,
  subCraft: SubCraftProps
  craft: CraftProps
}

type ArtisanPaginationProps = {
  artisans: ArtisanDetailProps[]
  metadata: {
    cursor?: string;
    hasNextPage: boolean;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
  }
}

type PortfolioProps = {
  portfolioId:string
  images:string[]
}

type ArtisanPortolioProps = {
  artisanId: string
  firstName: string,
  lastName: string,
  address: string,
  description: string,
  experience: string,
  education: string,
  training: string,
  certificate: string,
  recongnition: string,
  craftId: string,
  subCraftId: string,
  dp: string,
  subCraft: SubCraftProps
  craft: CraftProps
  Portfolio:PortfolioProps
}
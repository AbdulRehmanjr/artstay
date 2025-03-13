
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

type ArtisanPackageProps = {
  packageId: string;
  duration: number;
  features: string[];
  experience: string;
  price: number;
  title: string;
  artisanId: string;
  createdAt: Date;
  updatedAt: Date;
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
  ArtisanPackage: ArtisanPackageProps[]
}


type SafariProps = {
  safariId: string
  firstName: string
  lastName: string
  dp: string
  address: string
  description: string
  accountId: string
}

type SafariPaginationProps = {
  safaris: SafariProps[]
  metadata: {
    cursor?: string;
    hasNextPage: boolean;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
  }
}

type SafariTourProps = {
  tourId: string
  title: string
  operator: string
  description: string
  duration: string
  features: string[]
  fee: number
  safariId: string
  createdAt: Date
  updatedAt: Date
}

type SafariDetailProps = {
  safariId: string
  firstName: string
  lastName: string
  dp: string
  address: string
  description: string
  accountId: string
  SafariTour : SafariTourProps[]
}

type FairProps = {
  fairId: string
  firstName: string
  lastName: string
  dp: string
  address: string
  description: string
  accountId: string
}

type FairPaginationProps = {
  fairs: FairProps[]
  metadata: {
    cursor?: string;
    hasNextPage: boolean;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
  }
}

type FairEventProps = {
  eventId: string
  title: string
  location: FairLocationEnum
  vanue: string
  startDate: string
  endDate: string
  organizer: string
  fairType: FairTypeEnum
  latitude: number
  longitude: number
  description: string
  fairId: string
  createdAt: Date
  updatedAt: Date
}

type FairDetailProps = {
  fairId: string
  firstName: string
  lastName: string
  dp: string
  address: string
  description: string
  accountId: string
  FairEvent : FairEventProps[]
}

type ShopPaginationProps ={
  shops:ShopProps[]
  metadata: {
    cursor?: string;
    hasNextPage: boolean;
    totalItems?: number;
    currentPage?: number;
    totalPages?: number;
  }
}

type ShopProps = {
  shopId: string
  shopName: string
  description: string
  accountId: string
  dp: string
  address: string
  createdAt: Date
  updatedAt: Date
  }

type ProductProps = {
  productId: string
  name: string
  description: string
  price: number
  images: string[]
  category: string
  material: string
  dimensions: string
  weight: number
  stock: number
  isAvailable: boolean
  craftType: string
  artisanMade: boolean
  shopId: string
  createdAt: Date
  updatedAt: Date
}

type ShopDetailProps = {
  shopId: string
  shopName: string
  description: string
  accountId: string
  dp: string
  address: string
  createdAt: Date
  updatedAt: Date
  products: ProductProps[]
}


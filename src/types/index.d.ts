
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
  
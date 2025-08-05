import {ClientSearchFilters} from "@app/interfaces/client-search-filters";

export interface ClientParamsRequest {

  page: number;
  limit: number;
  order: string;
  filters: ClientSearchFilters;

}

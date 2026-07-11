import api from "@/api/axios";

import { RECRUITER_OFFER_ROUTES } from "../constants/recruiter-offer.routes";

import type {
  CreateOfferRequest,
  CreateOfferResponse,
  GetOfferDetailsResponse,
  GetRecruiterOffersResponse,
} from "../types/recruiterOffer.types";

export const createOffer = async (
  data: CreateOfferRequest,
): Promise<CreateOfferResponse> => {
  const response = await api.post(RECRUITER_OFFER_ROUTES.OFFERS, data);

  return response.data.data;
};

export const getRecruiterOffers = async (): Promise<
  GetRecruiterOffersResponse[]
> => {
  const response = await api.get(RECRUITER_OFFER_ROUTES.OFFERS);

  return response.data.data;
};

export const getOfferDetails = async (
  offerId: string,
): Promise<GetOfferDetailsResponse> => {
  const response = await api.get(RECRUITER_OFFER_ROUTES.OFFER_DETAIL(offerId));

  return response.data.data;
};

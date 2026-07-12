import api from "@/api/axios";

import { CANDIDATE_OFFER_ROUTES } from "../constants/candidate-offer.routes";

import type {
  AcceptOfferRequest,
  AcceptOfferResponse,
  GetCandidateOfferResponse,
  RejectOfferRequest,
  RejectOfferResponse,
} from "../types/candidateOffer.types";

export const getCandidateOffer = async (
  offerId: string,
): Promise<GetCandidateOfferResponse> => {
  const response = await api.get(CANDIDATE_OFFER_ROUTES.OFFER_DETAIL(offerId));
  console.log(response ? response : "no response for the getcandidate");
  return response.data.data;
};

export const acceptOffer = async (
  offerId: string,
  data: AcceptOfferRequest,
): Promise<AcceptOfferResponse> => {
  const response = await api.patch(
    CANDIDATE_OFFER_ROUTES.ACCEPT(offerId),
    data,
  );

  return response.data.data;
};

export const rejectOffer = async (
  offerId: string,
  data: RejectOfferRequest,
): Promise<RejectOfferResponse> => {
  const response = await api.patch(
    CANDIDATE_OFFER_ROUTES.REJECT(offerId),
    data,
  );

  return response.data.data;
};

import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';
import { apiService } from '~/services/apiService';
import type { ApiResponse } from '~/services/apiService';
import type { TataRuangForm } from '~/types/formData';

// Spatial Planning Mutation Hook
export const useSpatialPlanningMutation = (): UseMutationResult<
  AxiosResponse<ApiResponse>,
  Error,
  TataRuangForm
> => {
  return useMutation({
    mutationFn: apiService.submitSpatialPlanning,
    onMutate: (variables) => {
    },
    onSuccess: (data, variables) => {
    },
    onError: (error, variables) => {
    },
    onSettled: (data, error, variables) => {
    },
  });
};

// Building Report Mutation Hook (for future use)
export const useBuildingReportMutation = (): UseMutationResult<
  AxiosResponse<ApiResponse>,
  Error,
  any
> => {
  return useMutation({
    mutationFn: apiService.submitBuildingReport,
    onMutate: (variables) => {
    },
    onSuccess: (data, variables) => {
    },
    onError: (error, variables) => {
    },
  });
};

export const useWaterResourcesMutation = (): UseMutationResult<
  AxiosResponse<ApiResponse>,
  Error,
  any
> => {
  return useMutation({
    mutationFn: apiService.submitWaterResources,
    onMutate: (variables) => {
    },
    onSuccess: (data, variables) => {
    },
    onError: (error, variables) => {
    },
  });
};
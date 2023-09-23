// Import the API slice created using Redux Toolkit
import { apiSlice } from "./apiSlice";

// Define the base URL for user-related API endpoints
const USERS_URL = "/api/user";

// Create a user API slice by injecting endpoints
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Define a login mutation endpoint
    updateProfile: builder.mutation({
      query: (data) => {
        return {
          url: `${USERS_URL}/profile`,
          method: "POST",
          body: data,
        };
      },
    }),
    acceptRecruitment: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/accept-recruit`,
        method: "PATCH",
        body: data,
      }),
    }),
    getStreams: builder.mutation({
      query: (data) => {
        console.log("abhirami")
        return {
          url: `${USERS_URL}/getStreams`,
          method: "GET",
          body: data,
        };
      },
    }),
  }),
});

// Export hooks for each mutation endpoint for use in components
export const {
  useUpdateProfileMutation,
  useAcceptRecruitmentMutation,
  useGetStreamsMutation,
} = userApiSlice;

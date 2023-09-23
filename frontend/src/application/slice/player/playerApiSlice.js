// Import the API slice created using Redux Toolkit
// import { adminApiSlice } from "./adminApiSlice";
import { apiSlice } from "../user/apiSlice";
// Define the base URL for user-related API endpoints
const USERS_URL = "/api/player";

// Create a user API slice by injecting endpoints
export const playerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLive: builder.mutation({
      query: (data) => {
        console.log("nithin");
        console.log(data.get("title"));
        return {
          url: `${USERS_URL}/createLive`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

// Export hooks for each mutation endpoint for use in components
export const { useCreateLiveMutation } = playerApi;

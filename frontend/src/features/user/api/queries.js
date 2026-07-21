import { useQuery } from "@tanstack/react-query";
import { visitListApi } from "./index";

export const useVisits = () => {
  return useQuery({
    queryKey: ["visits"],
    queryFn: async () => {
      const res = await visitListApi();
      return res.data.visits?.block1 || [];
    },
  });
};

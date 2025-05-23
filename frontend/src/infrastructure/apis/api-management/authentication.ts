// import { LoginDTO } from "../client/models";
// import { AuthorizationApi } from "../client/apis";
import {useMutation} from "@tanstack/react-query";
import { AuthControllerApi, LoginDto, Configuration } from "../../../api/api8081";


/**
 * Use constants to identify mutations and queries.
 */
const loginMutationKey = "loginMutation";

export const useLogin = () => {
  const configuration = new Configuration({
    basePath: "http://localhost:8081"
  });
  const api = new AuthControllerApi(configuration);

  return useMutation({
    mutationKey: [loginMutationKey],
    mutationFn: (loginDTO: LoginDto) =>
      api.login({ loginDto: loginDTO })
  });
};
import { CognitoUserPool} from "amazon-cognito-identity-js";

const poolData = {
    UserPoolId: "eu-central-1_IW3Rxx1rC", // this information is on top menu in AWS Cognito
    ClientId: "412tqkcmajeirmgcuhhlbbqe3h",
}

export default new CognitoUserPool(poolData);


import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID } from "react-native-appwrite";

export const appwriteConfig = {
endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
platform:"com.dk.nutridesk",
databaseId: "6924520100130664cbb3",
userCollectionId: "user"
}

export const client = new Client();

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId).setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async({email , password , name}: CreateUserParams) => {
   try{
    
    
      const newAccount = await account.create(ID.unique() , email , name , password)

      if(!newAccount) throw Error;

      await signIn({email , password});

      const avatarUrl = avatars.getInitialsURL(name);
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { email , name , accountId: newAccount.$id , avatar: avatarUrl }
      );
   }catch(e){
      throw new Error(e as string)
  }

}

export const signIn = async ({email , password}: SignInParams  ) => {

    try{

        const session = await account.createEmailPasswordSession(email , password);
    }catch(e){
        throw new Error(e as string);
    }
}
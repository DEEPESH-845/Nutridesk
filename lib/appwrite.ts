
import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
platform:"com.dk.nutridesk",
databaseId: "6924520100130664cbb3",
bucketId: "692570170018cf90e00a",
userCollectionId: "user",
categoriesCollectionId: "categories",
menuCollectionId: "menu",
customisationCollectionId: "customisation",
menuCustomizationCollectionId: "menuCustomization",
}

export const client = new Client();

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId).setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async({email , password , name}: CreateUserParams) => {
   try{

    // DEBUGGING LINE: Check what is actually being sent
    console.log("Creating Account with:", {
       email: email, 
       passwordLength: password.length, // Should be >= 8
       passwordValue: password,         // Verify this isn't your Name!
       name: name 
    });

      const newAccount = await account.create(ID.unique() , email ,  password , name );

      if(!newAccount) throw Error;

      await signIn({email , password});

      const avatarUrl = avatars.getInitialsURL(name);
      return await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        ID.unique(),
        { email: email , name: name , accountid: newAccount.$id , avatar: avatarUrl }
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

export const getCurrentUser = async() => {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountid" , currentAccount.$id)]
        )

        if(!currentUser) throw Error

        return currentUser.documents[0];
    }catch(e){
        console.log(e);
        throw new Error(e as string);
    }

}
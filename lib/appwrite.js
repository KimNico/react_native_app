import { Client, Account,ID, Avatars, Databases, Query } from "react-native-appwrite"
export const config={
endpoint:'https://cloud.appwrite.io/v1',
platform:'com.react_native.aora',
project:'669838990000834c64f1',
databaseId:'66984247000cc131eacc',
userCollectionId:'669842700035b8d49022',
videoCollectionID:'6698428d0026fef23f7a',
storageId:'669843b800317f52603c'
}


const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.project)
    .setPlatform(config.platform)

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)

export const createUser = async (email,password,username)=>{
try {
    const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
    )
    if(!account) throw Error(error)
    const avatarUrl = avatars.getInitials(username)

    await signIn(email,password)
    const newUser = await databases.createDocument(config.databaseId, config.userCollectionId, ID.unique(),{
        accountId: newAccount.$id,
        email,
        username,
        avatar:avatarUrl
    })
    return newUser
} catch (error) {
    console.log(error);
    throw new Error(error)
}

}

export const signIn = async(email,password)=>{
    try {
        const session = await account.createEmailPasswordSession(email,password)
        return session
    } catch (error) {
        throw new Error(error)
    }
}


export async function getCurrentUser() {
    try {
  
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal("accountId", currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }
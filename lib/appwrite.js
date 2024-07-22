import { Client, Account,ID, Avatars, Databases, Query,Storage } from "react-native-appwrite"
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
const storage = new Storage(client)

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

    const currentAccount = await account.get()
      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
      );
  
      if (!currentUser) throw Error;
  
      return currentUser.documents[0];
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  export const getAllPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionID,
            [Query.orderDesc('$createdAt')]

        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
  }

  export const getLatestPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionID,
            [Query.orderDesc("$createdAt",Query.limit(7))]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
  }

  export const searchPosts = async(query)=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionID
            [Query.search("title",query)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
  }

  export const getUserPosts = async(userId)=>{
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionID
            [Query.equal("creator",userId)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error)
    }
  }

  export const signOut = async()=>{
    try {
        const session = await account.deleteSession('current')
    } catch (error) {
        throw new Error(error)
    }

  }

  export const getFilePreview = async(fileId,type)=>{
    let fileUrl;
    try {
        if(type === 'video'){
            fileUrl = storage.getFileView(config.storageId,fileId)
        }else if(type === 'image'){
            fileUrl = storage.getFilePreview(config.storageId,fileId,2000,2000,'top',100)
        }else{
            throw new Error('Formato de archivo invalido')
        }
        if(!fileUrl){
            throw Error
        }
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
  }
  
  export const uploadFile = async(file,type)=>{
    if(!file) return;
    const asset = {
        name:file.fileName,
        type:file.mimeType,
        size:file.fileSize,
        uri:file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(
            config.storageId,
            ID.unique(),
            asset

        )
        const fileUrl = await getFilePreview(uploadedFile.$id,type)
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
  }

  export const createVideo = async (form)=>{
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail,'image'),
            uploadFile(form.video,'video')
        ])
        const newPost = await databases.createDocument(
            config.databaseId,config.videoCollectionID, ID.unique(),{
                title:form.title,
                thumbnail:thumbnailUrl,
                video:videoUrl,
                prompt:form.prompt,
                creator:form.userId
            }
        )
        return newPost;
    } catch (error) {
        throw new Error(error)
    }
}
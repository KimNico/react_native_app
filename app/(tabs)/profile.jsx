import { View, FlatList, TouchableOpacity,Image } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from "../../components/SearchInput"
import EmptyState from '../../components/EmptyState'
import { getUserPosts, searchPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppWrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const {user, setUser, setIsLoggedIn} = useGlobalContext() 
  const { data:posts } =useAppwrite(()=>getUserPosts(user.$id))


const logout = async ()=>{
 await signOut()
 setUser(null);
 setIsLoggedIn(false) 
 router.replace('/sign-in')
} 


  return (
    <SafeAreaView className="bg-primary border-2 h-full">
      <FlatList
      data={posts}
      keyExtractor={(item)=>item.$id}
      renderItem={({item})=>(
        <VideoCard video={item}/>
        )}
      ListHeaderComponent={()=>(
        <View className="w-full justify-cente items-center mt-6 mb-12 px-4">
          <TouchableOpacity
          onPress={logout}
          className="w-full items-end mb-10"
          >
            <Image
            source={icons.logout}
            resizeMode='contain'
            className="w-6 h-6"
            onPress={logout}
            />
          </TouchableOpacity>
          <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
            <Image
            source={{uri: user?.avatar}}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode='cover'
            />
          </View>
          <InfoBox
          title={user?.username}
          containerStyle="mt-5"
          titleStyle="text-lg"
          />
          <View className="mt-5 flex-row">
             <InfoBox
             title={posts.length || 0}
             subtitle="Posts"
             containerStyle="mr-10"
             titleStyle="text-xl"
             />
               <InfoBox
             title='1.5k'
             subtitle="followers"
             containerStyle="mt-5"
             titleStyle="text-xl"
             />
          </View>
        </View>
      )}
      ListEmptyComponent={()=>(
          <EmptyState
          title="No videos found"
          subtitle="Videos no encontrados"
          />
          )}
      />
    </SafeAreaView>
  )
}

export default Profile
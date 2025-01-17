import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { images } from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link,router } from 'expo-router'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider";
import { SafeAreaView } from 'react-native-safe-area-context'


const SignIn = () => {
  const [form, setform] = useState({
    email:'',
    password:'',
  })
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmiting, setisSubmiting] = useState(false)

  const submit = async ()=>{
    if(!form.email || !form.password){
      Alert.alert('Error','Por favor llene los campos')
    }
    setisSubmiting(true)
    try {
      await signIn(form.email,form.password)
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);
      router.replace('/home')
  } catch (error) {
      Alert.alert('Error',error.message)
    }finally{
      setisSubmiting(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo}
          resizeMode="contain"
          className='w-[115px] h-[35px] '/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e)=>setform({...form,email:e})}
            otherStyles="mt-7"
            keyboardType="email-address"
          />
            <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e)=>setform({...form,password:e})}
            otherStyles="mt-7"
          />
          <CustomButton
          title="Sign In"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={isSubmiting}
          />
          <View className="justify-center pt-5 flex-row">
            <Text className="text-lg text-gray-100 font-pregular">
              No tienes cuenta? 
            </Text>
            <Link href="/sign-up" className='text-lg font-psemibold text-secondary'>Sign Up</Link>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn
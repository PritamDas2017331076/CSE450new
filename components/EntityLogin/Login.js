import React from 'react'
import {useState, useEffect, useContext} from 'react'
import { useSelector, useDispatch } from 'react-redux';
import {Text, View, StyleSheet,ScrollView} from 'react-native'
import { Form, FormItem, Picker } from 'react-native-form-component';
import {ip} from '../ip'
import {
  updateEmail,
  updateName,
  updateToken,
  updatePost,
  updateUniversity,
  updateDepartment,
  updateId,
  updateAvatar,
  selectEmail,
  selectName,
  selectToken,
  selectPost,
  selectUniversity,
  selectDepartment
} from '../Loginslice'
import axios from 'axios'

/*
selectIsLoggedin,
  selectLoggedinUser,
  selectEntity,
  selectToken,
*/

export default function Studentlogin({navigation}){
    const [email, setEmail] = useState('')
    const [post, setPost]=useState('')
    const [password, setPassword] = useState('')
    console.log(ip)

    const dispatch = useDispatch()

    
    const onSubmit = (e) => {
       // e.preventDefault()

        if(!email){
            alert('Please enter email')
            return
        }

        if(!post){
            alert('Please enter post')
        }

        if(!password){
            alert('Please enter password')
            return
        }
        /* onAdd({user,email,password,passwordr}) */

        const Details = {
            email: email,
            post: post,
            password: password
          }

        console.log(Details,ip)
        
        const pp=ip

        axios.post(`http://${pp}:5000/${post}/login`,Details)
          .then(
              res => {
               //   dispatch({type:"USER",payload:user})
                //  console.log(state)

                  console.log('data ',res.data)
                //  console.log('post ',res.data.admin.post)
                  console.log('data token ',res.data.token)
                  dispatch(updateToken(res.data.token))
                  dispatch(updatePost(res.data.post))
                  dispatch(updateId(res.data.id))
                  if(res.data.university) dispatch(updateUniversity(res.data.university))
                  if(res.data.department) dispatch(updateDepartment(res.data.department))
                  if(res.data.name) dispatch(updateName(res.data.name))
                  if(res.data.email) dispatch(updateEmail(res.data.email))
                  if(res.data.avatar) dispatch(updateAvatar(res.data.avatar))
                  navigation.navigate('Home')
              }
           ) 
           .catch(err =>{
              console.log('hah')
              console.log(err)
              alert(err.message)
           })

        setEmail('')
        setPost('')
        setPassword('')

        

        
    }
    return(
        <View style={styles.container}>
            <Form onButtonPress={onSubmit}>
            <FormItem
                label="Email"
                isRequired
                value={email}
                onChangeText={(email) => setEmail(email)}
                asterik
              />
            <FormItem
                label="Password"
                isRequired
                value={password}
                onChangeText={(password) => setPassword(password)}
                asterik
              />
              <Picker
                    items={[
                    { label: 'admin', value: 'admin' },
                    { label: 'university_admin', value: 'university_admin' },
                    { label: 'department_head', value: 'department_head' },
                    { label: 'teacher', value: 'teacher' },
                    { label: 'student', value: 'student' }
                   ]}
                    label="post"
                    style={styles.box}
                    selectedValue={post}
                    onSelection={(item) => setPost(item.value)}
                   />
            </Form>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        height: 80,
        padding: 50,
        backgroundColor: '#fff'
    },
    text:{
        color: 'red',
        fontSize: 20,
        justifyContent: 'center',
        fontWeight: 'bold',
    }

})
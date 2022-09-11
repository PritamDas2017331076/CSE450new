import React from 'react';
import {useState, useEffect} from 'react'
import axios from 'axios'
import { Button, View, Text, StyleSheet, ScrollView, TouchableOpacity, CheckBox, Image, TextInput, SafeAreaView, StatusBar, FlatList  } from 'react-native';
import {ip} from '../ip'
import { selectUniversity } from '../Loginslice';
import { useSelector, useDispatch } from 'react-redux';


export default function Date({route, navigation}){
    const { course_id,section } = route.params
    const [dist,setDist]=useState([])
    const [loading, setLoading] = useState(true)
    let fl=1


    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        axios.get(`http://${ip}:5000/bydate/sec?course_id=${course_id}&section=${section}`)
          .then(res=>{
            console.log(course_id,res.data)
            setDist(res.data.map((item,index)=>{
                return {date:item.date,record:item.record,id:item._id}
            }))
          })
          .catch((error) => console.error(error))
          .finally(() => {
            setLoading(false)
            fl=0 ;
          });
        })

  }, [navigation]);

  console.log(dist)
    const func = (item)=>{
      const date=item.date
      const chg={date: date }
      const chh={date: date, section: section }
      axios.delete(`http://${ip}:5000/bydate/${item.id}`)
        .then(res=>{
          console.log('successfully deleted bydate')
          axios.patch(`http://${ip}:5000/byreg/regd?course_id=${course_id}&section=${section}`,chg)
            .then(res=>{
              console.log('successfully updated in byreg')
              axios.patch(`http://${ip}:5000/course/recordd/${course_id}`,chh)
                .then(res=>{
                  console.log('successfully updated in course record')
                })
                .catch(err=>{console.log('error occurred course record',err)})
                .finally(()=>{navigation.goBack()})
            })
            .catch(err=>{console.log('error occurred in byreg',err)})
        })
        .catch(err=>{console.log('error occurred bydate',err)})
      // axios.patch(`http://${ip}:5000/byreg/regd?course_id=${course_id}&section=${section}`,chg)
      //   .then(res=>{
      //     console.log('successfully updated in byreg')
      //   })
      //   .catch(err=>{console.log('error occurred in byreg',err)})
      // axios.patch(`http://${ip}:5000/course/recordd/${course_id}`,chh)
      //   .then(res=>{
      //     console.log('successfully updated in course record')
      //   })
      //   .catch(err=>{console.log('error occurred course record',err)})
    }
    const Item = ({ item }) => (
      <View style={styles.item}>
         <TouchableOpacity style={{backgroundColor:'#f6f6f6',margin:20}} 
              onPress={()=>navigation.navigate('PrintDt',{
              record: item.record,
              course_id: course_id,
              section: section
         })}>
          <View>
              <Text>{item.date}</Text>
              <View style={{marginTop: '10px'}}>
              <Button onPress={()=>{
                    navigation.navigate('Utake',{
                        course_id: course_id,
                        section: section,
                        record: item.record,
                        date: item.date,
                        pid: item.id
                    })
                }} title="update"/>
              </View>
          </View>
         </TouchableOpacity>
         <TouchableOpacity onPress={()=>func(item)} >
           <Image source={require('./delete.png')} style={{height:50,width:50,color:'red'}} />
         </TouchableOpacity>
                           
         {/* <View style={styles.checkboxContainer}>
              <Text>{item.registration_number}</Text>
          </View> */}
      </View>
    );

    const renderItem = ({ item }) => (
      <Item item={item}   />
     );


    return(
        <View>
            {loading?<Text>loading</Text>
                   :<FlatList
                         data={dist}
                         renderItem={renderItem}
                         keyExtractor={item => item.id}
                       />
                    }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    checkboxContainer: {
      flexDirection: "row",
      marginBottom: 20,
    },
    checkbox: {
      alignSelf: "center",
      marginRight:20
    },
    label: {
      margin: 8,
    },
    item: {
      backgroundColor: '#f9c2ff',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      flexDirection: 'row'
    },
    title: {
      fontSize: 32,
    },
  });
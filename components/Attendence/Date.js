import React from 'react';
import {useState, useEffect} from 'react'
import axios from 'axios'
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, CheckBox, TextInput, SafeAreaView, StatusBar, FlatList  } from 'react-native';
import {ip} from '../ip'
import { selectUniversity } from '../Loginslice';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Button } from '@ui-kitten/components';
const getParsedDate = (strDate)=>{
  var strSplitDate = String(strDate).split(' ');
  var date = new Date(strSplitDate[0]);
  // alert(date);
  var dd = date.getDate();
  var mm = date.getMonth() + 1; //January is 0!

  var yyyy = date.getFullYear();
  if (dd < 10) {
      dd = '0' + dd;
  }
  if (mm < 10) {
      mm = '0' + mm;
  }
  date =  dd + "-" + mm + "-" + yyyy;
  return date.toString();
}
export default function Date({route, navigation}){
    const { course_id,section } = route.params
    const [dist,setDist]=useState([])
    const [loading, setLoading] = useState(true)
    const [jsDate,setJsDate] = useState([])
    let fl=1
    useEffect(() => {
      console.log('i have enterd in date list')
      const unsubscribe = navigation.addListener('focus', () => {
        axios.get(`${ip}/bydate/sec?course_id=${course_id}&section=${section}`)
          .then(res=>{
            // console.log(course_id,res.data)
            setDist(res.data.map((item,index)=>{
                // let splitDate = item.date.split(' ')
                // console.log('split date',splitDate)
                return {date:item.date.split(" "),record:item.record,id:item._id}
            }))
          })
          .catch((error) => console.error(error))
          .finally(() => {
            setLoading(false)
            fl=0 ;
          });
        })

  }, [navigation]);

  // console.log(dist)
    const Item = ({ item }) => (
      <View style={styles.item}>
         <TouchableOpacity style={{backgroundColor:'white',margin:20}} 
              onPress={()=>navigation.navigate('PrintDt',{
              record: item.record,
              course_id: course_id,
              section: section,
              id:item.id,
              date: item.date
         })}>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            {/* <View style={{flexDirection:'row',justifyContent:'space-between'}}> */}
              <Text>{item.date[1]} {item.date[2]}</Text>
              <Text>{item.date[4]}</Text>
            {/* </View> */}
          <View>
              <Button style={{width:100}} onPress={()=>{
                    navigation.navigate('Utake',{
                        course_id: course_id,
                        section: section,
                        record: item.record,
                        date: item.date,
                        pid: item.id
                    })
                }}>Update</Button>
              </View>
          </View>
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
            {loading?<Spinner
                      visible={true}
                      textContent={'Loading...'}
                      textStyle={styles.spinnerTextStyle}
                    />

                   :<FlatList
                         data={dist}
                         contentContainerStyle={{paddingBottom:150}}
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
      backgroundColor: 'white',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 32,
    },
  });
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,  { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSongExist, useDownloadSongFile, useplaySong } from "./utils/helper.ts";

import Form from 'react-native-jsonschema-form'
import jsonSchema from './jsonSchema'

import ReactNativeForm,  {defaultProps, FormContext}  from 'rjsf-native';

const App: () => React$Node = () => {
  const [progress, setProgress] = useState<number>(0);
  const { fileExist, checkSongExist} = useSongExist();
  const { downloadSong } = useDownloadSongFile(setProgress, checkSongExist);
  const { playSong } = useplaySong();

  // useEffect(() => {
  //   checkSongExist();
  // },[fileExist]);

  const form = useRef(null);

  return (
    <>
    <ScrollView>
      <View>
        <Text> Application</Text>
      </View>
      <View>
      {/* <AnimatedCircularProgress
        size={200}
        width={3}
        fill={progress}
        tintColor="#00e0ff"
        backgroundColor="#3d5875">
        {
          () => (
             fileExist ?
              <>
                <Button title={'Play'} onPress={() => {playSong()}}/>
              </>
            :
              <>
                <Button title={'Download'} onPress={() => {downloadSong()}}/>
                <Text> {progress} </Text>
              </>
          )
        }
      </AnimatedCircularProgress> */}
      </View>
      <View style={styles.container}>
        <View style={styles.notch}></View>
          {/* <Form
            schema={jsonSchema.form.schema}
            uiSchema={{...jsonSchema.form.uiSchema}}
            onSubmit={(submited)=>{
              Alert.alert(
              "u just submitted",
                JSON.stringify(submited.formData)          )
            }}
            submitTitle={"Submit"}
          /> */}
          <FormContext.Provider
            value={ {
              ...defaultProps,
            } }
          >
          <ReactNativeForm
            ref={form}
            onError={e => {
              console.log(e);
              Alert.alert('Please check your form');
            }}
            schema={jsonSchema.form.schema}
            uiSchema={jsonSchema.form.uiSchema}
            onSubmit={form => console.log(form.formData)}>
            <Button
              title="Submit"
              onPress={() => {
                form.$current?.submit();
              }}
            />
          </ReactNativeForm>
          </FormContext.Provider>

      </View>
    </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding:20
  },
  notch:{
    width:"100%" 
    }
});

export default App;

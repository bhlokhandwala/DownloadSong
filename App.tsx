/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,  { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';

import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSongExist, useDownloadSongFile, useplaySong } from "./utils/helper.ts";

const App: () => React$Node = () => {
  const [progress, setProgress] = useState<number>(0);
  const { fileExist, checkSongExist} = useSongExist();
  const { downloadSong } = useDownloadSongFile(setProgress, checkSongExist);
  const { playSong } = useplaySong();

  useEffect(() => {
    checkSongExist();
  },[fileExist]);

  return (
    <>
      <View>
        <Text>Song Application</Text>
      </View>
      <View>
      <AnimatedCircularProgress
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
      </AnimatedCircularProgress>
      </View>
    </>
  );
};

export default App;

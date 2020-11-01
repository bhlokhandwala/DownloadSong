/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React,  { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import RNFetchBlob from 'rn-fetch-blob'
import Sound from 'react-native-sound';


const App: () => React$Node = () => {
  const [progress, setProgress] = useState(0);
  const [fileExist, setFileExist] = useState(false);

  const checkSongExist = () => {
    let path = RNFetchBlob.fs.dirs.DocumentDir + "songburhan.mp3";
    RNFetchBlob.fs.exists(path)
    .then((exist) => {
      if (exist){
        setFileExist(true);
      } else {
        setFileExist(false);
      }
      console.log(`file ${exist ? '' : 'not'} exists`)
    })
    .catch((err) => { console.log(err); })
  }
  checkSongExist();

  const playSong = () => {
    let path = RNFetchBlob.fs.dirs.DocumentDir + "songburhan.mp3";
    Sound.setCategory('Playback', true);
    var song = new Sound(path, '', (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        return;
      }
      // loaded successfully
      console.log('duration in seconds: ' + song.getDuration() + 'number of channels: ' + song.getNumberOfChannels());
      // Play the sound with an onEnd callback
      song.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    });
  }

  const downloadSongFile = () => {
    RNFetchBlob.fetch('GET', 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3')
    // listen to download progress event
    .progress((received, total) => {
        console.log('progress', received / total*100)
        setProgress(Math.round(received / total*100));
    })
    .then((resp) => {
      let path = RNFetchBlob.fs.dirs.DocumentDir + "songburhan.mp3" 
      RNFetchBlob.fs.writeFile(path, resp.data, 'base64')
      .then((result) => {
        console.log("File has been saved to:" + result)
      })
      .catch(error => console.log('File save error',error));

      setProgress(100);
      setFileExist(true);
    })
    .catch((err) => {
      console.log(err);
    })
  }

  return (
    <>
      <View  >
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
            <>
            {fileExist ?
              <Button title={'Play'} onPress={() => {playSong()}}/>
            :
              <>
                <Button title={'Download'} onPress={() => {downloadSongFile()}}/>
                <Text>
                  {progress}
                </Text>
              </>
            }
            </>
          )
        }
      </AnimatedCircularProgress>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

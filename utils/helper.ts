import { useState } from 'react';
import RNFetchBlob from 'rn-fetch-blob';
import Sound from 'react-native-sound';

// custom hooks useSongExist
export const useSongExist = () => {
  const [fileExist, setFileExist] = useState<boolean>(false);
  return {
    fileExist,
    checkSongExist: e => {
      let path:string = RNFetchBlob.fs.dirs.DocumentDir + "songburhan.mp3";
      RNFetchBlob.fs.exists(path)
      .then((exist:boolean) => {
        if (exist){
          setFileExist(true);
        } else {
          setFileExist(false);
        }
        console.log(`file ${exist ? '' : 'not'} exists`)
      })
      .catch((err:any) => { console.log(err); })
    }
  };
};

// custom hooks useDownloadSongFile
export const useDownloadSongFile = (setProgress, setFileExist) => {
  return {
    downloadSong : () => {
    let songSource : string = 'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3';
      RNFetchBlob.fetch('GET', songSource)
      // listen to download progress event
      .progress((received:number, total:number) => {
          console.log('progress', received / total*100)
          setProgress(Math.round(received / total*100));
      })
      .then((resp:any) => {
        let path:string = RNFetchBlob.fs.dirs.DocumentDir + "songburhan.mp3" 
        RNFetchBlob.fs.writeFile(path, resp.data, 'base64')
        .then((result:number) => {
          console.log("File has been saved to:" + result)
        })
        .catch((error:any) => console.log('File save error',error));

        setProgress(100);
        setFileExist(true);
      })
      .catch((err:any) => {
        console.log(err);
      })
    }
  }
}

// custom hooks useplaySong
export const useplaySong = () => {
  return {
    playSong : () => {
      let path:string = RNFetchBlob.fs.dirs.DocumentDir + "songburhan.mp3";
      Sound.setCategory('Playback', true);
      let song:object= new Sound(path, '', (error:any) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // loaded successfully
        console.log('duration in seconds: ' + song.getDuration() + 'number of channels: ' + song.getNumberOfChannels());
        // Play the sound with an onEnd callback
        song.play((success:boolean) => {
          if (success) {
            console.log('successfully finished playing', success);
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      });
    }
  }
}
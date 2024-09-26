import logo from "./logo.svg";
import "./App.css";

import { QrReader } from "react-qr-reader";
import { useEffect, useRef, useState } from "react";

function App() {
  const [data, setData] = useState("No result");
  const [constraints, setConstraints] = useState({ video: true });
  const qrReaderRef = useRef(null);
  const maxZoomLevel = 3; // Set the maximum zoom level
  const minZoomLevel = 1; // Set the minimum zoom level

  useEffect(() => {
    // Access the camera track after the component mounts
    const getMediaTrack = () => {
      if (qrReaderRef.current) {
        const video = qrReaderRef.current.video;
        if (video && video.srcObject) {
          const track = video.srcObject.getVideoTracks()[0];
          if (track && track.getCapabilities) {
            const capabilities = track.getCapabilities();
            // Check if the camera supports zoom
            if (capabilities.zoom) {
              setConstraints({
                video: {
                  ...constraints.video,
                  zoom: { ideal: 3, max: maxZoomLevel, min: minZoomLevel },
                },
              });
              // Set initial zoom level
              track.applyConstraints({ advanced: [{ zoom: 3 }] });
            }
          }
        }
      }
    };

    getMediaTrack(); // Get the media track when the component loads
  }, []);

  return (
    <>
      <QrReader
        onResult={(result, error) => {
          if (!!result) {
            setData(result?.text);
          }

          if (!!error) {
            console.info(error);
          }
        }}
        style={{ width: "100%" }}
      />
      <p>{data}</p>
    </>
  );
}

export default App;

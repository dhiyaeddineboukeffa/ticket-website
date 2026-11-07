// @ts-nocheck

import { MdPowerSettingsNew, MdQrCodeScanner } from "react-icons/md";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function StartScan({ handler }: any) {
  const [result, setResult] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const [mount, setMount] = useState<boolean>(false);
  const navigate = useNavigate();

  const StartScanner = () => {
    var scanner = new Html5Qrcode("reader");
    html5QrcodeRef.current = scanner;
    scanner
      .start(
        { facingMode: "environment" }, // Prefer the rear camera
        {
          fps: 10, // Scan frames per second
          qrbox: { width: "280px", height: "352px" }, // Set the size of the scanning box
          aspectRatio: 1.7777778, // Aspect ratio for the video feed
        },
        onScanSuccess,
        onScanFailure
      )
      .then(() => {
        setIsScanning(true);
        setErrorMessage(null);
      })
      .catch((err) => {
        // Handle errors, e.g., camera permission denied
        console.error("Failed to start QR scanner.", { err });
        setErrorMessage(
          "Failed to start scanner. Please grant camera permission and try again."
        );
        setIsScanning(false);
        StopScanner();
      });
  };

  const StopScanner = () => {
    if (!html5QrcodeRef.current) return;

    html5QrcodeRef.current
      .stop()
      .then(() => {
        html5QrcodeRef.current = null;
        setIsScanning(false);
      })
      .catch((err) => {
        console.error("Failed to stop QR scanner.", err);
        setErrorMessage("Could not stop the scanner.");
      });
  };

  const onScanSuccess = (result) => {
    StopScanner();
    handler(result);
  };

  const onScanFailure = (err) => {
    console.log(err);
  };

  useEffect(() => {
    setMount(true);
    return () => {
      if (html5QrcodeRef.current) StopScanner();
      setMount(false);
    };
  }, []);

  if (mount)
    return (
      <article className="card mx-auto mt-4 p-4 max-w-[450px] sm:min-w-[420px] w-12/12">
        <div className="flex gap-2 text-2xl items-center font-bold">
          <MdQrCodeScanner className="text-3xl" />
          QR Code Scanner
        </div>
        <h2 className="text-textSec text-sm mt-2 ml-1">
          Position the client's QR Code within the frame
        </h2>

        <aside className="relative">
          <div
            id="reader"
            className=" bg-[#DBE7F0] grid place-content-center rounded-md border-2 border-gray-300 border-dotted h-[352px] !overflow-hidden w-[280px] mx-auto my-4"
          ></div>

          {!isScanning && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {errorMessage && (
                <h1 className="text-red-600 opacity-60 mt-3 text-center text-xs mb-4">
                  {errorMessage}
                </h1>
              )}
              <MdQrCodeScanner className="text-5xl text-center mx-auto relative z-50" />
              <h1 className="text-textPri opacity-60 mt-3 text-center">
                Scanner is Off. Click Start To Active.
              </h1>
            </div>
          )}
        </aside>

        <button
          onClick={isScanning ? StopScanner : StartScanner}
          className={`button flex justify-center  w-full duration-200 text-white py-1.5 rounded-md items-center gap-2 ${
            isScanning ? "bg-red-600" : "bg-sec"
          }`}
        >
          <MdPowerSettingsNew /> {isScanning ? "Stop" : "Start"} Scan
        </button>
      </article>
    );
}

export default StartScan;

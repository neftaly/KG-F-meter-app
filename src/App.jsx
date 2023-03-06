import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)

  const getDevices = () => {
    navigator.bluetooth.requestDevice({ 
      "acceptAllDevices":true,
        optionalServices: [
          0x180A,
          0x1800,
          0x1801,
          "0000fff0-0000-1000-8000-00805f9b34fb",
          "0000ffe0-0000-1000-8000-00805f9b34fb"
        ]
     })
      .then(device => {
        console.log('Connecting to GATT Server...', device);
        return device.gatt.connect();
      })
      .then(server => {
        console.log('Getting Service...', server);
        return server.getPrimaryService(
          // '0000fff0-0000-1000-8000-00805f9b34fb'
          "0000ffe0-0000-1000-8000-00805f9b34fb"
          );
      })
      .then(service => {
        console.log('Getting Characteristic...',service)
        return service.getCharacteristic(
          // '0000fff1-0000-1000-8000-00805f9b34fb'
          "0000ffe1-0000-1000-8000-00805f9b34fb"
          );
      })
      .then(characteristic => {
        return characteristic.startNotifications().then(d => {
          console.log('> Notifications started',characteristic,d);
          characteristic.addEventListener('characteristicvaluechanged', event => {
            const {value }= event.target;
            // console.info(new TextDecoder('utf-8').decode(value));

            let a = [];
            // Convert raw data bytes to hex values just for the sake of showing something.
            // In the "real" world, you'd use data.getUint8, data.getUint16 or even
            // TextDecoder to process raw data bytes.
            for (let i = 0; i < value.byteLength; i++) {
              // a.push('0x' + ('00' + value.getUint8(i).toString(16)).slice(-2));
              a.push(value.getUint8(i).toString(16));
            }
            console.info('> ' + a.join(' '));

          });
        });
      })
      .catch(error => { console.error(error); });
  }

  return (
    <div>
        <button onClick={getDevices} children='get devices' />
    </div>
  )
}

export default App

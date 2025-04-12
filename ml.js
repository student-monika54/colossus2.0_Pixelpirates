// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBQtyPF9jx2HjyfB16PHQzb73BYUHetais",
    authDomain: "colossus-1849e.firebaseapp.com",
    databaseURL: "https://colossus-1849e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "colossus-1849e",
    storageBucket: "colossus-1849e.firebasestorage.app",
    messagingSenderId: "445118916584",
    appId: "1:445118916584:web:b2a45564653e3785ba665d"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // ML training data
  const trainInputs = tf.tensor2d([
    [24, 50, 25, 150],
    [28, 65, 70, 300],
    [30, 40, 30, 200],
    [22, 85, 75, 100],
    [26, 55, 35, 250],
    [27, 60, 60, 180],
    [27, 66, 0, 446],
    [28, 65, 10, 400],
    [26, 70, 15, 420]
  ]);
  
  const trainLabels = tf.tensor2d([
    [1], [0], [1], [0], [1], [0], [1], [1], [1]
  ]);
  
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
  
  async function trainModel() {
    await model.fit(trainInputs, trainLabels, { epochs: 150 });
  }
  
  async function fetchAndPredict() {
    try {
      const snapshot = await firebase.database().ref('sensorData').once('value');
      if (snapshot.exists()) {
        const data = snapshot.val();
  
        document.getElementById("temp").textContent = data.temperature.toFixed(1);
        document.getElementById("humid").textContent = data.humidity.toFixed(1);
        document.getElementById("moist").textContent = data.moisture;
        document.getElementById("light").textContent = data.light;
  
        const input = tf.tensor2d([[data.temperature, data.humidity, data.moisture, data.light]]);
        const prediction = model.predict(input);
        const confidence = (await prediction.data())[0];
        const pumpStatus = confidence > 0.5 ? "💧 Pump ON" : "🌿 Pump OFF";
        const misterCommand = confidence > 0.5 ? "on" : "off";
  
        // Update UI
        document.getElementById("prediction").textContent = pumpStatus;
        document.getElementById("confidence").textContent = (confidence * 100).toFixed(1) + "%";
        document.getElementById("mister").textContent = misterCommand.toUpperCase();
        document.getElementById("care").textContent = "Analyzed using live IoT data.";
  
        // Send action to Firebase
        firebase.database().ref('actions/mister').set(misterCommand);
      } else {
        document.getElementById("care").textContent = "No sensor data found.";
      }
    } catch (err) {
      console.error("Firebase error:", err);
      document.getElementById("care").textContent = "Error reading data.";
    }
  }
  
  (async () => {
    await trainModel();
    await fetchAndPredict();
  })();
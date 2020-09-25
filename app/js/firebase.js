const firebaseConfig = {
    apiKey: "AIzaSyDCq-7AMuzzE2p1L0HWya_S5gQKHxnffpk",
    authDomain: "canvas-dnd.firebaseapp.com",
    databaseURL: "https://canvas-dnd.firebaseio.com",
    projectId: "canvas-dnd",
    storageBucket: "canvas-dnd.appspot.com",
    messagingSenderId: "360232971172",
    appId: "1:360232971172:web:1c5fd915836579aede2f31"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const writeData = () => {
    firebase.database().ref('figures/').set(figures)
}

const readData = () => {
    const newData = []
    firebase.database().ref('figures/').on('value', (snapshot) => {
        snapshot.forEach(item => {
            const elem = item.val()
            if (elem.elemType === 'rect') {
                newData.push(new Rect(elem.x, elem.y, elem.w, elem.h, elem.color, elem.elemType))
            }
            if (elem.elemType === 'circle') {
                newData.push(new Circle((elem.x - elem.r), (elem.y - elem.r), elem.r, elem.sAngle, elem.eAngle,
                    elem.clockwise, elem.color, elem.elemType))
            }
        })
        figures.splice(0, figures.length, ...newData)
    })
}
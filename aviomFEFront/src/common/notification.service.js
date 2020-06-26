import { NOTIFICATION_API_URL } from "@/common/settings.service";
import { ADD_CONTROLLER } from "@/store/mutations.type";
import Stomp from "webstomp-client";
import store from '@/store';

//Protocol constants
const NEW_EVENT_ENTITY="";
const NEW_AVAILABLE_CONTROLLER="New_Available_Controller";
const NEW_EVENT_ASSIGMENT="";

//Bussines functions
function init(){
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else {
        Notification.requestPermission();
    }
}

//Note: The Eventbus pattern may be a good option. But it doesn't 
//allow the flexibility of having a single source that manages 
//the propagation of events over common data structures.
const NotificationManager = {
    run(topic) {
        init();

        //the version to be used is defined by the client.
        //Note: use protocol version greater than 1.0, because 1.0 doesn't contain the heartbeat
        const options = { debug: true, protocols: ["v11.stomp"]};
        const connection = Stomp.client(NOTIFICATION_API_URL, options);
        
        connection.connect(
            {}, //credentials need to be added to the service.
            (frame) => {
                connection.subscribe(topic, (tick) => {

                    let body = JSON.parse(tick.body);
                    
                    if(body.cause == NEW_AVAILABLE_CONTROLLER){
                        store.commit(ADD_CONTROLLER, body.content[0]);
                    }
                    
                });
            },
            (error) => {
            
            }
        )
    }
};

export default NotificationManager;  
import React from "react";

 function SingleSchedule(props, deleteSchedule) {

    return(
        <div key={props.schedule_id}>
        <li>{props.schedule_id}</li>
        <li>{props.uuid}</li>
        <li>{props.title}</li>
        <li>{props.description}</li>
        <li>{props.create_time}</li>
        <li>{props.user_id}</li>
        {/* Saves the id of the schedule as value of button when delete button is
         pressed then activates the delete function with schudele id as value */}
        <button
         onClick={()=>{props.deleteSchedule(props.schedule_id)}}>DELETE</button>
        </div>
    )
}
export default SingleSchedule;
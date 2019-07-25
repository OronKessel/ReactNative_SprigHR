import {Config} from '../doc/config';

export function serviceAuthorization(email,password){ 

    var params = {
        email:email,
        password:password
    }; 
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/authorization", {
        method: 'POST',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetEmployeeInfo(){ 
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/employees", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}


export function serviceGetFeedbacks(){ 
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/feedbacks", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetNotes(){ 
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/notes", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceAddNote(title,content){ 
    
    var params = {
        note_name:title,
        note_description:content
    }; 
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/notes", {
        method: 'POST',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceUpdateNote(id,title,content){ 
    
    var params = {
        note_name:title,
        note_description:content
    }; 
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/notes/" + id, {
        method: 'PUT',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceDeleteNote(id){     
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/notes/" + id, {
        method: 'DELETE',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceCompanyDirectory(){     
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/organization/employee_directory", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetTasks(){     
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/tasks", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceSubmitFeedback(empId,subject,message,feedback_type,hr_visible,anonymous,field_linked){ 

    var params = {
        employee_id:empId,
        feedback:{
            subject:subject,
            message:message,
            feedback_type:feedback_type,
            hr_visable:hr_visible,
            anonymous:anonymous,
            linked_competency:field_linked
        }
    };    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/feedbacks", {
        method: 'POST',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetDomains(email){     
    var params = {
        email:email
    }; 
    return new Promise(function(resolve, reject) {        
        fetch(Config.DOMAIN_URL+"/domains", {
        method: 'POST',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}
export function serviceOrganizationInfo()
{
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/organization", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    }); 
}
export function serviceGetProfile(){     
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/employee_profile_fields", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceGetEmpProfile(empId){     
    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/organization/employees/" + empId + "/profile", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}


export function serviceAuthSSO(accessToken){     
    
    var params = {
        token:accessToken
    }; 
    console.warn(Config.BASE_URL);   
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/authorization/sso", {
        method: 'POST',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });      
}

export function serviceRequestFeedback(empId,subject){ 

    var params = {
        subject:subject
    };    
    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/organization/employees/" + empId + "/request_feedback", {
        method: 'POST',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        },
        body: JSON.stringify(params)
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceTeamGroups(){ 

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/team/groups/", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceTeamEmployees(id){ 

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/team/groups/" + id + "/employees", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}


export function serviceCompetencies(id){ 

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/organization/employees/" + id + "/competencies", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {            
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}

export function serviceTeamFeedbacks(gid,id){ 

    return new Promise(function(resolve, reject) {        
        fetch(Config.BASE_URL+"/team/groups/" + gid + "/employees/" + id + "/feedbacks", {
        method: 'GET',
        headers: {
            'Version':Config.Version,
            'Content-Type': Config.ContentType,
            'Accept':Config.Accept,
            'Authorization':Config.AuthToken
        }
        })
        .then((response) => {    
            response.json()
            .then((res)=>{
                if(response.status == '200')
                    resolve(res);
                else
                    reject(res);
            })
        })
        .catch((error) => {
            reject(error);
        });
    });    
}










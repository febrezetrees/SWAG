//API function to assign a role to a user after they are authenticated, using claims etc. from the identity provider

//Referred to here via the SWA application config file "rolesSource": "/api/GetRoles",

//Each time a user successfully authenticates with an identity provider, this function is called via the POST method. This function is passed a JSON object in the POST request body that contains the user's information from the provider. For some identity providers, the user information also includes an accessToken that the function can use to make API calls using the user's identity.

//The function can use the user's information to determine which roles to assign to the user. It must return an HTTP 200 response with a JSON body containing a list of custom role names to assign to the user.

const fetch = require('node-fetch').default;

// add role names to this object to map them to group ids in your AAD tenant
const roleGroupMappings = {
    'admin': '21a96550-aa02-486e-9297-e6e51b6398fc',
    'reader': '33bb071c-118d-40d1-a5d7-7ced5900b973'
};

module.exports = async function (context, req) {
    const user = req.body || {};
    const roles = [];
    
    for (const [role, groupId] of Object.entries(roleGroupMappings)) {
        if (await isUserInGroup(groupId, user.accessToken)) {
            roles.push(role);
        }
    }

    context.res.json({
        roles
    });
}

async function isUserInGroup(groupId, bearerToken) {
    const url = new URL('https://graph.microsoft.com/v1.0/me/memberOf');
    url.searchParams.append('$filter', `id eq '${groupId}'`);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${bearerToken}`
        },
    });

    if (response.status !== 200) {
        return false;
    }

    const graphResponse = await response.json();
    const matchingGroups = graphResponse.value.filter(group => group.id === groupId);
    return matchingGroups.length > 0;
}
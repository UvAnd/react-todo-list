type GenerateId = () => string;
export const generateId: GenerateId = () => (
    Math.random().toString(16).slice(2) + new Date().getTime().toString(36)
);

// INFO: Back-up to localstorage

// {"Requested":{"name":"Requested","items":[{"id":"2eb68a64c09bl7ceo4i3","title":"test","createdAt":1661635156683},{"id":"009d9b97d78e2l7ceoh1y","title":"new 2 new","createdAt":1661635172950},{"id":"3e06a944b6a75l7c4bqul","title":"test drag","createdAt":1661617782957},{"id":"97ae385a017e9l7c3l6o3","title":"test","createdAt":1661616543747}]},"Todo":{"name":"Todo","items":[{"id":"43f16eb91f21dl7c3vfr8","title":"test 2","createdAt":1661617022084}]},"InProgress":{"name":"In Progress","items":[]},"Done":{"name":"Done","items":[]}}
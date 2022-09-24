const getAuth = function (req, res, next) {
  const token = req.headers['authorization'];
  const db = req.app.get('db');
  if (req.user) {
    // query to get the user role's  permissions for a resource
    if (token) {
      // handle jwt token authenticity and decrypt payload

      // get permission handler
      db.getPerms({ role_id: req.user.role_id, resource_id: req.resource.id })
        .then((perms) => {
          let allow = false;
          // mapping of methods to permissions
          perms.forEach(function (perm) {
            if (req.method == 'POST' && perms.create) allow = true;
            else if (req.method == 'GET' && perms.read) allow = true;
            else if (req.method == 'PUT' && perms.write) allow = true;
            else if (req.method == 'DELETE' && perm.delete) allow = true;
          });
          if (allow) next();
          else {
            res.status(403).send({ error: 'access denied' });
          }
        })
        .catch((err) => {
          // handle your reject and catch here
        });
    } else {
      res.status(400).send({ error: 'invalid token' });
    }
  }
};

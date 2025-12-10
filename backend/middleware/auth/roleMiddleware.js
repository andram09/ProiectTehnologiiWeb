export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(401).send("Nu exista user in request => neautorizat");

    if (!allowedRoles.includes(req.user.role))
      return res
        .status(403)
        .send("Nu aveti permisiunea de a accesa aceasta pagina!!");

    next();
  };
};

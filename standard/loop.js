setInterval(() => {
  deviceIdStatus(accesstoken).then((data_status) => {
    console.log(data_status);
    if ((data_status === true) && (device_status === false)) {
      device_status = true;
      console.log(device_status);
      lineSendmsg(data_status);
    }
    if (data_status === false) {
      device_status = false;
      console.log(device_status);
    }
  });

}, 60000);
$(document).ready(() => {
  $.validator.addMethod('address4', (val) => {
    const ip = new Address4(val);
    return ip.isValid();
  }, 'Invalid IP Address');

  $('form').validate();
  console.log('Document ready');
  $('#vpc-cidr').change((event) => {
    const vpcCidr = $(event.currentTarget).val();
    console.log(vpcCidr);
    // var cidr = new Address4(vpcCidr);
  });

  // $('#subnet-count').change((event) => {
  //
  // });
  // let step;
  // for (step = 0; step < 5; step += 1) {
  //   console.log('walking east one step', step);
  // };
  $('#subnet-count').change((event) => {
    const $selector = $('#subnet-main');
    const subnetCount = $(event.currentTarget).val();
    for (let count = 0; count <= subnetCount; count += 1) {
      console.log(`subnet-${count}`);
      $selector.append($(`<label for="subnet-${count}">Subnet CIDR</label>`));
      $selector.append($(`< input class = "form-control"
                    type = "text"
                    id = "subnet-${count}" >`));
    }
  });
  $('#subnet1').change((event) => {
    const vpcCidr = new Address4('192.168.1.0/27');
    const address = new Address4($(event.currentTarget).val());
    console.log(address.isInSubnet(vpcCidr));
    if (address.isInSubnet(vpcCidr)) {
      console.log(address.correctForm());
    } else {
      alert(address.correctForm());
    }
  });

  $('#add-vpc-col').click(() => {
    console.log('Adding VPC');
  });

  $('#remove-vpc').click(() => {
    console.log('Removing VPC');
  });
});

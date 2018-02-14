$(document).ready(function() {

  console.log("Document ready");
  $('#vpc-cidr').change((event) => {

    let vpcCidr = $(event.currentTarget).val();
    var cidr = new Address4(vpcCidr);
  });

  $('#subnet1').change((event) => {
    vpcCidr = new Address4("192.168.1.0/24")
    var address = new Address4($(event.currentTarget).val());
    console.log(address.isInSubnet(vpcCidr));
    if (address.isInSubnet(vpcCidr)) {
      console.log(address.correctForm() + " is in range");
    } else {
      flash(address.correctForm() + " is not in range.");
    }
    });

  $('#add-vpc-col').click(function(){
    console.log('Adding VPC');
  })
  $('#remove-vpc').click(function(){
    console.log('Removing VPC');
  })

})

$(document).ready(() => {
  $.validator.addMethod('address4', (val) => {
    const ip = new Address4(val);
    return ip.isValid();
  }, 'Invalid IP Address');

  $('form').validate();
  // 2000 as a value breaks.
  $('form').on('change', '#subnet-count', () => {
    const $selector = $('#subnet-main');
    const subnetCount = $('#subnet-count').val();
    $selector.empty();
    if ($('#subnet-count').hasClass('error')) {
      return;
    }
    for (let count = 1; count <= subnetCount; count += 1) {
      $selector.append($(`
        <div class="form-group">
          <label for="subnet-${count}">Subnet CIDR #${count}</label>
          <input class="form-control" type = "text" id="subnet-${count}" data-rule-address4="true">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="auto-ip-${count}">
            <label class="form-check-label" for="auto-ip-${count}">Public?</label>
          </div>
        </div>
        `));
    }
  });
  $('#subnet1').change((event) => {
    const vpcCidr = new Address4($('#vpc-cidr').val());
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

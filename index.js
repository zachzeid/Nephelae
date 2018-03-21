$(document).ready(() => {
  $.validator.addMethod('address4', (val) => {
    const ip = new Address4(val);
    return ip.isValid();
  }, 'Invalid IP Address');

  $.validator.addMethod('cidr-range', (val) => {
    const ip = new Address4(val);
    if (ip.subnetMask >= 16 && ip.subnetMask <= 28) {
      return true;
    }
    return false;
  }, 'Invalid CIDR Range (Must be between /16 && /28)');

  $.validator.addMethod('subnet', (val) => {
    const vpcCidr = new Address4($('#vpc-cidr').val());
    const ip = new Address4(val);
    return ip.isInSubnet(vpcCidr);
  }, 'Subnet doesn\'t match');

  $.validator.addMethod('subnet-overlap', (val) => {
    const subnets = $('.subnet-input');
    const ip = new Address4(val);
    for (let i = 0; i < subnets.length; i += 1) {
      const otherCidr = new Address4($(subnets[i]).val());
      // TODO: We need to fix this, it's a bug
      // TODO:  We are trying to make sure that we don't check against the value of itself.
      if (otherCidr.toHex() !== ip.toHex()) {
        if (otherCidr.isValid() && (ip.isInSubnet(otherCidr) || otherCidr.isInSubnet(ip))) {
          return false;
        }
      }
    }
    return true;
  }, 'Subnets overlap');

  $('form').validate();
  // CIDR Range Validation


  // Conversion to JSON
  // Integration with API endpoint
  // Create API endpoint to Troposphere
  // Write to file
  $('form').on('change', '#subnet-count', () => {
    const $selector = $('#subnet-main');
    const subnetCount = $('#subnet-count').val();
    $selector.empty();
    if (!$('#subnet-count').valid()) {
      return;
    }
    for (let count = 1; count <= subnetCount; count += 1) {
      $selector.append($(`
        <div class="form-group">
          <label for="subnet-${count}">Subnet CIDR #${count}</label>
          <input class="form-control subnet-input" type="text" id="subnet-${count}" data-rule-address4="true" data-rule-cidr-range="true" data-rule-subnet="true" data-rule-subnet-overlap="true">
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="auto-ip-${count}">
            <label class="form-check-label" for="auto-ip-${count}">Public?</label>
          </div>
        </div>
        `));
    }
  });
});

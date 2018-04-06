$(document).ready(() => {
  $('form').validate({
    submitHandler(form, event) {
      const vpc = {};
      const subnets = $('.subnet-input');
      event.preventDefault();
      vpc.vpccidr = $('#vpc-cidr').val();
      vpc.subnets = [];
      for (let i = 0; i < subnets.length; i += 1) {
        vpc.subnets.push({
          cidr: $(subnets[i]).val(),
          public: $(`#auto-ip-${i + 1}`).prop('checked'),

        });
      }
      $.post({
        url: '/api/create',
        data: JSON.stringify(vpc),
        contentType: 'application/json',
      }).then((data) => {
        const blob = new Blob([data], {
          type: 'text/plain;charset=utf-8',
        });
        saveAs(blob, 'template.json');
      });
      location = location;
    },
  });

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
    const masks = {};

    for (let i = 0; i < subnets.length; i += 1) {
      const otherCidr = new Address4($(subnets[i]).val());

      if (ip.isValid() && otherCidr.isValid()) {
        if (otherCidr.mask() !== ip.mask()) {
          if (ip.isInSubnet(otherCidr) || otherCidr.isInSubnet(ip)) {
            return false;
          }
        } else if (masks[otherCidr.mask()]) {
          return false;
        }

        masks[otherCidr.mask()] = true;
      }
    }
    // It would be helpful if we could force a revalidation of subnet fields when
    // subnet fields are changed to fix overlaps.
    // But it's tricky as the way the validator currently works forces an infinite loop.
    return true;
  }, 'Subnets overlap');

  // Integration with API endpoint
  $('#subnet-count').change(() => {
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

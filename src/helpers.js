import { google } from 'googleapis';
import { auth } from 'google-auth-library';
import { KEYS } from './constant';

export const backToTop = () => {
  // Handle back to top of page
  window.scrollTo(0, 0);
}

export const clientAuthorize = async () => {
  // TODO: Change placeholder below to generate authentication credentials. See
  // https://developers.google.com/sheets/quickstart/nodejs#step_3_set_up_the_sample
  //
  // Authorize using one of the following scopes:
  //   'https://www.googleapis.com/auth/drive'
  //   'https://www.googleapis.com/auth/drive.file'
  //   'https://www.googleapis.com/auth/spreadsheets'

  let authClient = auth.fromJSON(KEYS);
  authClient.scopes = ['https://www.googleapis.com/auth/spreadsheets'];

  if (authClient == null) {
    throw Error('authentication failed');
  }

  return authClient;
}

export const clientRequest = async (orderInfo, formValue) => {
  // Google sheets instance
  const sheets = google.sheets('v4');
  const authClient = await clientAuthorize();
  const request = {
    // The ID of the spreadsheet to update.
    spreadsheetId: orderInfo.id, // TODO: Update placeholder value.

    // The A1 notation of a range to search for a logical table of data.
    // Values are appended after the last row of the table.
    range: orderInfo.range, // TODO: Update placeholder value.

    // How the input data should be interpreted.
    valueInputOption: 'RAW', // TODO: Update placeholder value.

    // How the input data should be inserted.
    insertDataOption: 'INSERT_ROWS', // TODO: Update placeholder value.

    // TODO: Add desired properties to the request body.
    resource: {
      majorDimension: 'ROWS', // log each entry as a new row (vs column)
      values: [formValue], // convert the object's values to an array
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.values.append(request))
      .data;
    // TODO: Change code below to process the `response` object:
    if (response) {
      console.log('Success');
    }
  } catch (err) {
    console.error(err);
  }
}

export const loadFacebookScript = (component) => {
  component.$loadScript(
    'https://connect.facebook.net/vi_VN/sdk.js#xfbml=1&version=v8.0'
  )
    .then(() => {
      // Script is loaded, do something
      component.$nextTick(() => {
        window.FB.XFBML.parse();
      });
    })
    .catch(() => {
      // Failed to fetch script
      console.log('Script loading error');
    });
}

export const moneyFlyEffect = () => {
  let timeoutFunction = null;
  clearTimeout(timeoutFunction);
  timeoutFunction = setTimeout(() => {
    const root = document.documentElement,
      moneyOrder = document.querySelector('.money-order');
    let moneyOrderRect = moneyOrder
      ? moneyOrder.getBoundingClientRect()
      : null,
      moneyCheckbox = document.querySelectorAll('.money-checkbox');
    let checkedItem,
      checkedImage,
      moneyOrderLeft,
      moneyOrderTop,
      checkedImageRect,
      checkedImageLeft,
      checkedImageTop;
    moneyCheckbox.forEach((checkboxItem) => {
      checkboxItem.addEventListener('click', (event) => {
        checkedItem = event.target.closest('.money-form-group');
        checkedImage = checkedItem.querySelector('.money-image');
        if (event.target.checked) {
          // Get order position
          moneyOrderLeft = Math.round(moneyOrderRect.x);
          moneyOrderTop = Math.round(moneyOrderRect.y);
          // Get checked image position
          checkedImageRect = checkedImage
            ? checkedImage.getBoundingClientRect()
            : null;
          checkedImageLeft = Math.round(checkedImageRect.x);
          checkedImageTop = Math.round(checkedImageRect.y);
          // Set order position to document styles
          root.style.setProperty(
            '--order-left',
            moneyOrderLeft - checkedImageLeft + 'px'
          );
          root.style.setProperty(
            '--order-top',
            moneyOrderTop - checkedImageTop + 'px'
          );
          // Add flying class for money image
          checkedImage.classList.add('money-image-flying');
          // Remove flying class after 1s
          setTimeout(() => {
            checkedImage.classList.remove('money-image-flying');
          }, 1500);
        }
      });
    });
  }, 200);
}

export const moneySerialSplit = () => {
  let timeoutFunction = null;
  clearTimeout(timeoutFunction);
  timeoutFunction = setTimeout(() => {
    let moneySerialText = document.querySelectorAll(
      '.money-serial-vertical .money-serial-text, .money-serial-horizontal .money-serial-text'
    );
    moneySerialText.forEach((serialTextItem) => {
      // Split money serial text into characters
      serialTextItem.innerHTML = serialTextItem.textContent.replace(
        /\D/g,
        "<span class='character'>$&</span>"
      );
    });

    let moneySerialNumber = document.querySelectorAll(
      '.money-serial-vertical .money-serial-number, .money-serial-horizontal .money-serial-number'
    );
    moneySerialNumber.forEach((serialNumberItem) => {
      // Split money serial text into characters
      serialNumberItem.innerHTML = serialNumberItem.textContent.replace(
        /\d/g,
        "<span class='character number'>$&</span>"
      );
    });
  }, 200);
}

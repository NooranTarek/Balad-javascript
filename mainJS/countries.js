//_________________________________________________________________________________________________________
//when click on the link go to the select box
document.getElementById('chooseNowLink').addEventListener('click', function (event) {
  event.preventDefault();
  document.getElementById('countryDropdown').focus();
});
//__________________________________________________________________________________________________________
// to add comma in the number of population
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
//__________________________________________________________________________________________________________
// to make select box shows all countries
fetch("https://restcountries.com/v3.1/all")
  .then((response) => response.json())
  .then((data) => {
    const countryDropdown = document.getElementById("countryDropdown");
    data.sort((first, second) =>
      first.name.common.localeCompare(second.name.common)
    );
    //create options
    data.forEach((country) => {
      const option = document.createElement("option");

      //if the country name is "Is****" change it to "Palestine"
      if (country.name.common === "Israel") {
        option.value = "Palestine";
        option.textContent = "Palestine";
      } else {
        option.value = country.name.common;
        option.textContent = country.name.common;
      }

      countryDropdown.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching country names", error));
//__________________________________________________________________________________________________________
// here to show country facts part
async function fetchCountryData() {
  const selectedCountry = document.getElementById("countryDropdown").value;
  const hiddenDiv = document.getElementById("hiddenDiv");
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${selectedCountry}`
    );
    const data = await response.json();
    console.log(data);

    document.getElementById("flagImage").src = data[0].flags.png;
    document.getElementById("coatOfArmsImage").src = data[0].coatOfArms.png;
    document.getElementById("population").innerText = numberWithCommas(data[0].population);
    document.getElementById("region").innerText = data[0].region;
    document.getElementById("startOfWeek").innerText = data[0].startOfWeek;
    document.getElementById("timeZone").innerText = data[0].timezones[0];
    document.getElementById("capital").innerText = data[0].capital[0];
    

    //true false
    const trueIcon = document.getElementById("trueIndependent");
    const falseIcon = document.getElementById("falseIndependent");
    trueIcon.style.display = data[0].unMember ? "inline" : "none";
    falseIcon.style.display = data[0].unMember ? "none" : "inline";
    const trueIcon2 = document.getElementById("true");
    const falseIcon2 = document.getElementById("false");
    trueIcon2.style.display = data[0].independent ? "inline" : "none";
    falseIcon2.style.display = data[0].independent ? "none" : "inline";
    const countryName = data[0].name.common;

    //map
    const googleMapsFrame = document.getElementById("googleMapsFrame");
    googleMapsFrame.src = `https://www.google.com/maps?q=${countryName}&hl=en&z=6&output=embed`;
    const googleMapsLink = document.getElementById("googleMapsLink");
    googleMapsLink.href = `https://www.google.com/maps?q=${countryName}`;
    hiddenDiv.style.display = "block";

    //calling news function
    fetchAndDisplayNews(countryName);
  } catch (error) {
    console.log("SORRY !! Error in fetching country data", error);
  }
}
//__________________________________________________________________________________________________________
//sending email
emailjs.init("D3SlAh1MUQ9MsJUci");
function sendEmail(event) {
  //alert("hello");
  event.preventDefault();

  var fullName = document.getElementById("fullName").value;
  var email = document.getElementById("email").value;
  var message = document.getElementById("message").value;
  emailjs
    .send("service_mg4j6hs", "template_izyrv6m", {
      to_name: fullName,
      from_email: email,
      message: message,
    })
    .then(
      function (response) {
        console.log("Email sent successfully", response);
        document.getElementById("fullName").value = " ";
        document.getElementById("email").value = " ";
        document.getElementById("message").value = " ";
      },
      function (error) {
        console.error("Email sending failed", error);
      }
    );
}
//__________________________________________________________________________________________________________
//news images
function loadImageWithDefaultImageUrl(url, defaultImageUrl, timeout = 5000) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // clear the timeout if the image loads successfully
      clearTimeout(timeoutId); 
      resolve(img.src);
    };
    img.onerror = () => {
      resolve(defaultImageUrl);
    };
    // Set a timeout for image loading
    const timeoutId = setTimeout(() => {
      // abort image loading in case of timeout
      img.src = ""; 
      resolve(defaultImageUrl);
    }, timeout);
    //loading the image
    img.src = url.endsWith('/') ? url.slice(0, -1) : url;
  });
}
//__________________________________________________________________________________________________________
//news data
async function fetchAndDisplayNews(countryName) {
  const newsContainer = document.getElementById("newsContainer");
  try {
    const response = await fetch(
      `https://api.worldnewsapi.com/search-news?api-key=a36bb7c640ef43a5b8167d055e4921ab&text=${countryName}`
    );
    const newsData = await response.json();
    console.log(newsData);
    newsContainer.innerHTML = "";

    const newsArticles = newsData.news;
    for (let i = 0; i < Math.min(10, newsArticles.length); i++) {
      const article = newsArticles[i];

      const truncatedDesc = article.text ? article.text.slice(0, 100) : "No description available";
      const titleElimination = article.title ? article.title.slice(0, 100) : "No title available";
      const autherElimination = article.author ? article.author.slice(0, 10) : "Unknown Author";

      //default image link if no image is provided
      const defaultImageUrl = "https://i.ytimg.com/vi/GIFV_Z7Y9_w/maxresdefault.jpg";
      const image = await loadImageWithDefaultImageUrl(article.image, defaultImageUrl,5000);
      
      //new news box
      const newsBox = document.createElement("div");
      newsBox.className = "col-md-3 col-sm-6";
      newsBox.innerHTML = `
        <div class="news-box">
          <div class="new-thumb">
            <span class="cat c1">News</span>
            <img src="${image}" alt="Default Image" />
          </div>
          <div class="new-txt">
            <ul class="news-meta">
              <li>${article.publish_date ? new Date(article.publish_date).toDateString() : "No date available"}</li>
            </ul>
            <h6>
              <a href="${article.url}" target="_blank">${titleElimination}</a>
            </h6>
            <p>${truncatedDesc}</p>
          </div>
          <div class="news-box-f">
            <img
              src="https://www.pngitem.com/pimgs/m/150-1503945_transparent-user-png-default-user-image-png-png.png"
              alt="Author Image"
            />
            ${autherElimination}
            <a href="#"><i class="fas fa-arrow-right"></i></a>
          </div>
        </div>
      `;
      newsContainer.appendChild(newsBox);
    }
  } catch (error) {
    console.error("Error fetching news data", error);
  }
}


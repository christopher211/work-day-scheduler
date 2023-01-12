const businessHoursArr = [9, 10, 11, 12, 13, 14, 15, 16, 17];

$(document).ready(function () {
  const currentDate = dayjs().format("dddd, MMMM Do, YYYY");
  const currentHour = dayjs().hour();

  $("#currentDay").text(`${currentDate}`);

  // Get the time base on current hour (past, present, future)
  const getTime = (h) => {
    if (currentHour < h) {
      return "future";
    } else if (currentHour > h) {
      return "past";
    } else {
      return "present";
    }
  };

  const showHideDeleteIcon = (str) => {
    const storageKeys = Object.keys(localStorage);
    if (storageKeys.includes(str)) {
      return "";
    } else {
      return "hidden";
    }
  };

  // Create time block content element depend on business hours
  businessHoursArr.forEach((h) => {
    // Time block
    $("<div/>", {
      id: `hour-${h}`,
      class: `row time-block ${getTime(h)}`,
    }).appendTo("#time-block-container");

    // Create business hour text
    $("<div/>", {
      id: `text-center-${h}`,
      class: "col-2 col-md-1 hour text-center py-3",
    }).appendTo(`#hour-${h}`);

    $("<p/>", {
      text: `${h}:00`,
    }).appendTo(`#text-center-${h}`);

    // Create delete icon
    $("<i/>", {
      class: `delete-icon fas fa-trash ${showHideDeleteIcon(`hour-${h}`)}`,
      click: () => {
        clearSpecificWorkPlan(`hour-${h}`);
      },
    })
      .attr("aria-hidden", "true")
      .appendTo(`#text-center-${h}`);

    // Create textarea
    $("<textarea/>", {
      class: "col-8 col-md-10 description",
    })
      .attr("rows", "3")
      .appendTo(`#hour-${h}`);

    // Create save button
    $("<button/>", {
      id: `saveBtn-${h}`,
      class: "btn saveBtn col-2 col-md-1",
    })
      .attr("aria-label", "save")
      .appendTo(`#hour-${h}`);

    // Create save icon
    $("<i/>", {
      class: "fas fa-save",
    })
      .attr("aria-hidden", "true")
      .appendTo(`#saveBtn-${h}`);
  });

  $("<button/>", {
    id: `clearBtn`,
    class: "btn btn-danger",
    text: "Clear all",
    click: (e) => {
      clearAllWorkPlans(e);
    },
  }).appendTo(`.btn-container`);

  const saveWorkPlanData = () => {
    // Get all button elements by class
    const saveBtns = $(".saveBtn");
    // Add a click event listener to each save button
    saveBtns.on("click", function (e) {
      // The `this` keyword refers to the element that was clicked
      const saveBtns = $(this);
      // Find the time-block element that contains the save button
      const timeBlock = saveBtns.closest(".time-block");
      // Get the id of the time-block element (e.g. "hour-9")
      const id = timeBlock.attr("id");
      // Get the value of the description input field
      const description = timeBlock.find(".description").val();
      console.log(description.length);
      if (description.length === 0 || description === "") {
        alert("There is no data to save!");
        return;
      }
      // Save the description in local storage with key is id
      localStorage.setItem(id, JSON.stringify(description));
      // Show delete icon after add data
      $(`#${id} .text-center .delete-icon`).removeClass("hidden");
    });
  };

  // Get work plan data from local storage
  const retrieveWorkPlanData = () => {
    $(".time-block").each(function () {
      let id = $(this).attr("id");
      let data = localStorage.getItem(id);
      if (data) {
        $(this).find(".description").val(JSON.parse(data));
      }
    });
  };

  const clearSpecificWorkPlan = (key) => {
    // Show a browser alert to confirm user action
    const confirm = window.confirm("Are you sure to clear this data?");

    if (confirm) {
      // Clear local storage by key
      localStorage.removeItem(key);
      // Clear text in textarea description
      $(`#${key} .description`).val("");
      // Hide delete icon
      $(`#${key} .text-center .delete-icon`).addClass("hidden");
    }
  };

  // Clear all the work plan in local storage
  const clearAllWorkPlans = (e) => {
    // Check if local storage has data
    if (localStorage.length === 0) {
      window.alert("There is no data!");
      return;
    }

    // Show a browser alert to confirm user action
    const confirm = window.confirm("Are you sure to clear all data?");

    if (confirm) {
      // Clear all storage
      localStorage.clear();
      // Clear text in textarea description
      $(".time-block .description").val("");
      // Hide delete icon
      $(`.time-block .text-center .delete-icon`).addClass("hidden");
    }
  };

  saveWorkPlanData();
  retrieveWorkPlanData();
});

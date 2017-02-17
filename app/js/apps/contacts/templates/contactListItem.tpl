<!--By default, Bootstrap's thumbnails are designed to showcase linked 
    images with minimal required markup.-->
<div class="box thumbnail">
  <div class="photo">
    <% if (avatar && avatar.url) { %>
    <img src="<%= avatar.url %>" class="img-responsive" alt="<%= avatar.file %>"/>
      <% } else { %>
    <img src="..\..\..\..\img\250_250.png" class="img-responsive" alt="Contact photo" />
    <% } %>
    <div class="action-bar clearfix">
      <div class="action-buttons pull-right">
        <button id="delete" class="btn btn-danger btn-xs">delete</button>
        <button id="view" class="btn btn-primary btn-xs">detail</button>
      </div>
    </div>
  </div>
  <div class="caption caption-container">    
      <h4>
        <strong class="text-info"><%= name %></strong>
      </h4>
      <% if (phone) { %>
      <p class="phone no-margin">
        <%= phone %>
      </p>
      <% } %>
      <% if (email) { %>
      <p class="email no-margin">
        <%= email %>
      </p>
      <% } %>
      <p class="bottom">
        <ul class="social-networks">
          <% if (facebook) { %>
          <li>
            <a href="<%= facebook %>" title="Google Drive">
              <i class="fa fa-facebook"></i>
            </a>
          </li>
          <% } %>
          <% if (twitter) { %>
          <li>
            <a href="<%= twitter %>" title="Twitter">
              <i class="fa fa-twitter"></i>
            </a>
          </li>
          <% } %>
          <% if (google) { %>
          <li>
            <a href="<%= google %>" title="Google Drive">
              <i class="fa fa-google-plus"></i>
            </a>
          </li>
          <% } %>
          <% if (github) { %>
          <li>
            <a href="<%= github %>" title="Github">
              <i class="fa fa-github"></i>
            </a>
          </li>
          <% } %>
        </ul>
      </p>
    </div>
</div>
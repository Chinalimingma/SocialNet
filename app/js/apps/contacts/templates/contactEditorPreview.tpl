<!--The thumbnail component to easily display grids of images, videos, text, and more.-->
<!--The Container is <div class="box thumbnail">...</div> with contactPreview provides-->
<div class="photo">
    <% if (avatar && avatar.url) { %>
    <img src="<%= avatar.url %>" alt="<%= avatar.file %>" />
    <% } else { %>
    <img src="../../../../img/250_250.png" alt="Contact photo" />
    <% } %>
    <!--display:none will not be available in the page and does not occupy any space.-->
    <input id="avatar" name="avatar" type="file" style="display: none" />

    <span class="info"></span>
    <span class="notice"></span>
    
    <div class="alert alert-success" role="alert">
        Click the image to change the avatar<br />
        Press the shift key to upload multiple files at the same time
    </div>
    <div id="progressbar"></div>
    
</div>
<div class="caption">
    <h5>
       <strong><%= name %></strong> 
    </h5>
    <p class="phone no-margin">
        <%= phone %>
    </p>
    <p class="email no-margin">
        <%= email %>
    </p>
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
</div>

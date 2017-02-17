<div class="panel-heading">About <%= name %></div>
<div class="pabel-body">
  <div class="contact-info">
    <div class="bio">
      <span class="text-info h4">Biography</span>
      <p>
      <mark>Bio:</mark> <%= bio %>
      </p>
    </div>
    <span class="text-info h4">Basic information</span>
    <div class="table-responsive">
      <table class="table">
        <tbody>
          <tr>
            <th>Email</th>
            <td><a href="mailto:<%= email %>"><%= email %></a></td>
          </tr>
          <tr>
            <th>Phone</th>
            <td><%= phone %></td>
          </tr>
          <tr>
            <th>Social</th>
            <td>
              <ul class="list-inline">
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
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <span class="text-info h4">Personal information</span>
    <div class="table-responsive">
      <table class="table">
        <tbody>
          <tr>
            <th>Name</th>
            <td><%= name %></td>
          </tr>
          <tr>
            <th>Address</th>
            <td><%= address1 %></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
<div class="panel-footer clearfix">
  <div class="panel-buttons">
    <button id="back" class="btn btn-primary">Go back</button>
    <button id="delete" class="btn btn-danger">Delete</button>
    <button id="edit" class="btn btn-success">Edit contact</button>
  </div>
</div>